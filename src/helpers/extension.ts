import { lstatSync, writeFile } from 'fs';
import { window, workspace } from 'vscode';

import { CONFIGURATIONS } from './constants';
import Context from './context';
import {
  fileSort,
  getAllFilesFromSubfolders,
  getConfig,
  getFilesAndDirsFromPath,
  getFolderNameFromDialog,
  toOsSpecificPath,
  toPosixPath
} from './functions';
import { Maybe } from './types';

/**
 * Entry point of the extension. When this function is called
 * the context should have already been set up
 */
export const init = async () => {
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

/**
 * Validates if the given `uri` is valid to generate a barrel file and,
 * if so, generates a barrel file in it
 *
 * @returns A promise with the path where the barrel file will be written
 * @throws {Error} If the selected `uri` is not valid
 */
const validateAndGenerate = async (): Promise<Maybe<string>> => {
  let targetDir;

  if (!Context.activePath.path) {
    targetDir = await getFolderNameFromDialog();

    if (!targetDir) {
      throw Error('Select a directory!');
    }

    targetDir = toPosixPath(targetDir);

    if (!lstatSync(targetDir).isDirectory()) {
      throw Error('Select a directory!');
    }
  } else {
    if (!lstatSync(toPosixPath(Context.activePath.fsPath)).isDirectory()) {
      throw Error('Select a directory!');
    }

    targetDir = toPosixPath(Context.activePath.fsPath);
  }

  if (workspace.workspaceFolders) {
    const currDir = toPosixPath(workspace.workspaceFolders[0].uri.fsPath);

    if (!targetDir.includes(currDir)) {
      throw Error('Select a folder from the workspace');
    } else {
      return generate(targetDir);
    }
  } else {
    throw Error('The workspace has no folders');
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

  for (const t of files) {
    exports = `${exports}export '${t}';\n`;
  }

  Context.writeFolderInfo({ path: targetPath, fileCount: files.length });
  const barrelFile = `${targetPath}/${dirName}.dart`;

  return new Promise((resolve) => {
    const path = toOsSpecificPath(barrelFile);

    writeFile(path, exports, 'utf8', (error) => {
      if (error) {
        throw Error(error.message);
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
  const shouldAppend = getConfig<boolean>(CONFIGURATIONS.values.APPEND_FOLDER);
  const shouldPrepend = getConfig<boolean>(
    CONFIGURATIONS.values.PREPEND_FOLDER
  );

  // Selected target is in the current workspace
  // This could be optional
  const splitDir = targetPath.split('/');
  const prependedDir = shouldPrepend ? `${splitDir[splitDir.length - 1]}_` : '';
  const appendedDir = shouldAppend ? `_${splitDir[splitDir.length - 1]}` : '';

  // Check if the user has the defaultBarrelName config set
  const defaultBarrelName = getConfig<string>(
    CONFIGURATIONS.values.DEFAULT_NAME
  );
  if (defaultBarrelName) {
    return `${prependedDir}${defaultBarrelName
      .replace(/ /g, '_')
      .toLowerCase()}${appendedDir}`;
  }

  // If the user has set the promptName option, use always such name
  let barrelFileName: string =
    Context.customBarrelName ?? splitDir[splitDir.length - 1];

  // If there's a customBarrelName, it means that the user has already
  // been prompted
  if (
    !Context.customBarrelName &&
    getConfig(CONFIGURATIONS.values.PROMPT_NAME)
  ) {
    const result = await window.showInputBox({
      title: `Barrel file name (${Context.customBarrelName})`,
      prompt:
        'Enter the name of the barrel file without the extension. If no name is entered, the folder name will be used',
      placeHolder: 'Ex: index'
    });

    barrelFileName = result ? result : barrelFileName;
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
const generate = async (targetPath: string): Promise<Maybe<string>> => {
  const skipEmpty = getConfig(CONFIGURATIONS.values.SKIP_EMPTY);
  const barrelFileName = await getBarrelFile(targetPath);
  if (Context.activeType === 'REGULAR_SUBFOLDERS') {
    const files = getAllFilesFromSubfolders(barrelFileName, targetPath).sort(
      fileSort
    );
    if (files.length === 0 && skipEmpty) {
      return Promise.resolve(undefined);
    }

    return writeBarrelFile(targetPath, barrelFileName, files);
  }

  const [files, dirs] = getFilesAndDirsFromPath(barrelFileName, targetPath);
  if (Context.activeType === 'RECURSIVE' && dirs.size > 0) {
    for (const d of dirs) {
      const maybeGenerated = await generate(`${targetPath}/${d}`);
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

export { validateAndGenerate };
