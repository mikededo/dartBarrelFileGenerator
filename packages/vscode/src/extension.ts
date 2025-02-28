import type { GenerationConfiguration, GenerationType, Maybe } from '@dbf/core';

import type { VSCodeConfigKeyToValue, VSCodeConfigurationKeys } from './constants.js';

import { lstatSync, writeFile } from 'node:fs';
import type { Uri } from 'vscode';
import { window, workspace } from 'vscode';

import {
  fileSort,
  GeneratorContext,
  getAllFilesFromSubfolders,
  getFilesAndDirsFromPath,
  isTargetLibFolder,
  toOsSpecificPath,
  toPosixPath
} from '@dbf/core';

import { CONFIGURATIONS } from './constants.js';

const logger = window.createOutputChannel('DartBarrelFile');
const Context = new GeneratorContext({ log: logger.appendLine });

/**
 * Returns the configuration value of the given config value
 *
 * @param config Configuration value name
 * @returns The configuration value if any
 */
const getConfig = <T extends VSCodeConfigurationKeys>(config: T): undefined | VSCodeConfigKeyToValue[T] =>
  workspace.getConfiguration().get([CONFIGURATIONS.key, config].join('.'));

/**
 * Shows a vscode dialog to select a folder to create a barrel file to
 *
 * @returns The selected path if any
 */
const getFolderNameFromDialog = (): Thenable<string | undefined> =>
  window.showOpenDialog(CONFIGURATIONS.input).then(uri =>
    // The selected input is in the first array position
    uri && uri.length > 0
      ? uri[0].path
      : undefined
  );

/**
 * Validates if the given `uri` is valid to generate a barrel file and,
 * if so, generates a barrel file in it
 *
 * @returns A promise with the path where the barrel file will be written
 * @throws {Error} If the selected `uri` is not valid
 */
const validateAndGenerate = async (): Promise<Maybe<string>> => {
  const config: GenerationConfiguration = {
    excludedDirs: getConfig('excludeDirList') ?? [],
    excludedFiles: getConfig('excludeFileList') ?? [],
    excludeFreezed: !!getConfig('excludeFreezed'),
    excludeGenerated: !!getConfig('excludeGenerated')
  };

  let targetDir = '';
  if (!Context.activePath.path) {
    targetDir = await getFolderNameFromDialog() ?? '';

    if (!targetDir) {
      throw new Error('Select a directory!');
    }

    targetDir = toPosixPath(targetDir);

    if (!lstatSync(targetDir).isDirectory()) {
      throw new Error('Select a directory!');
    }
  } else {
    if (!lstatSync(toPosixPath(Context.activePath.fsPath)).isDirectory()) {
      throw new Error('Select a directory!');
    }

    targetDir = toPosixPath(Context.activePath.fsPath);
  }

  if (workspace.workspaceFolders) {
    const currDir = toPosixPath(workspace.workspaceFolders[0].uri.fsPath);

    if (!targetDir.includes(currDir)) {
      throw new Error('Select a folder from the workspace');
    }

    // eslint-disable-next-line ts/no-use-before-define
    return generate(targetDir, config);
  } else {
    throw new Error('The workspace has no folders');
  }
};

/**
 *
 * @param targetPath The target path of the barrel file
 * @param dirName The barrel file directory name
 * @param files The file names to write to the barrel file
 * @returns A promise with the path of the written barrel file
 */
const writeBarrelFile = (
  targetPath: string,
  dirName: string,
  files: string[]
): Promise<string> => {
  let exports = '';
  // Check if we should prepend the package
  const shouldPrependPackage = getConfig('prependPackageToLibExport') && isTargetLibFolder(targetPath);
  const prependPackageValue = shouldPrependPackage
    ? `package:${Context.packageName}/`
    : '';

  for (const file of files) {
    exports = `${exports}export '${prependPackageValue}${file}';\n`;
  }

  Context.writeFolderInfo({ fileCount: files.length, path: targetPath });
  const barrelFile = `${targetPath}/${dirName}.dart`;

  return new Promise((resolve) => {
    const path = toOsSpecificPath(barrelFile);

    writeFile(path, exports, 'utf8', (error) => {
      if (error) {
        throw new Error(error.message);
      }

      Context.writeSuccessfullInfo(path);
      resolve(path);
    });
  });
};

/**
 * @param targetPath The target path of the barrel file
 * @returns A promise with the name of the barrel file
 */
const getBarrelFile = async (targetPath: string): Promise<string> => {
  // Check if prepend or append is wanted
  const shouldAppend = getConfig('appendFolderName');
  const shouldPrepend = getConfig('prependFolderName');

  // Selected target is in the current workspace
  // This could be optional
  const splitDir = targetPath.split('/');
  const prependedDir = shouldPrepend ? `${splitDir[splitDir.length - 1]}_` : '';
  const appendedDir = shouldAppend ? `_${splitDir[splitDir.length - 1]}` : '';

  // Check if the user has the defaultBarrelName config set
  const defaultBarrelName = getConfig('defaultBarrelName');
  if (defaultBarrelName) {
    return `${prependedDir}${defaultBarrelName.replace(/ /g, '_').toLowerCase()}${appendedDir}`;
  }

  // If the user has set the promptName option, use always such name
  let barrelFileName: string =
    Context.customBarrelName ?? splitDir[splitDir.length - 1];

  // If there's a customBarrelName, it means that the user has already
  // been prompted
  if (!Context.customBarrelName && getConfig('promptName')) {
    const result = await window.showInputBox({
      placeHolder: 'Ex: index',
      prompt:
        'Enter the name of the barrel file without the extension. If no name is entered, the folder name will be used',
      title: `Barrel file name (${Context.customBarrelName})`
    });

    barrelFileName = result || barrelFileName;
    Context.customBarrelName = barrelFileName;
  }

  return `${prependedDir}${barrelFileName}${appendedDir}`;
};

/**
 * Generates the contents of the barrel file, recursively when the
 * option chosen is recursive
 *
 * @param targetPath The target path of the barrel file
 * @returns A promise with the path of the written barrel file
 */
const generate = async (targetPath: string, config: GenerationConfiguration): Promise<Maybe<string>> => {
  const skipEmpty = getConfig('skipEmpty');
  const barrelFileName = await getBarrelFile(targetPath);

  if (Context.activeType === 'REGULAR_SUBFOLDERS') {
    const files = getAllFilesFromSubfolders(
      barrelFileName,
      targetPath,
      config
    ).sort(fileSort);

    if (files.length === 0 && skipEmpty) {
      return Promise.resolve(undefined);
    }

    return writeBarrelFile(targetPath, barrelFileName, files);
  }

  const [files, dirs] = getFilesAndDirsFromPath(barrelFileName, targetPath, config);
  if (Context.activeType === 'RECURSIVE' && dirs.size > 0) {
    for (const d of dirs) {
      const maybeGenerated = await generate(`${targetPath}/${d}`, config);
      if (!maybeGenerated && skipEmpty) {
        continue;
      }

      files.push(
        toPosixPath(maybeGenerated as string).split(`${targetPath}/`)[1]
      );
    }
  }

  if (files.length === 0 && skipEmpty) {
    return Promise.resolve(undefined);
  }

  // Sort files
  return writeBarrelFile(targetPath, barrelFileName, files.sort(fileSort));
};

/**
 * Entry point of the extension. When this function is called
 * the context should have already been set up
 */
export const init = async (uri: Uri, type: GenerationType) => {
  Context.initGeneration({ fsPath: uri.fsPath, path: uri.path, type });

  if (!Context.activeType) {
    Context.onError(
      'Extension did not launch properly. Create an issue if this error persists'
    );
    Context.endGeneration();

    window.showErrorMessage('GBDF: Error on initialising the extension');
  }

  try {
    const maybeGenerated = await validateAndGenerate();

    if (maybeGenerated) {
      await window.showInformationMessage(
        'GDBF: Generated files!',
        maybeGenerated
      );
    } else {
      await window.showInformationMessage(
        'GDBF: No dart barrel file has been generated!'
      );
    }

    Context.endGeneration();
  } catch (error: any) {
    Context.onError(error);
    Context.endGeneration();

    window.showErrorMessage('GDBF: Error on generating the file', error);
  }
};

export const deactivate = () => {
  Context.deactivate();
};
