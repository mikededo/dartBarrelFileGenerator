import { lstatSync, readdirSync, writeFile } from 'fs';
import { get, isNil } from 'lodash';
import { window, workspace } from 'vscode';

import { GEN_TYPE } from './';
import { CONFIGURATIONS } from './constants';
import Context from './context';
import {
  fileSort,
  getConfig,
  getFolderNameFromDialog,
  shouldExport,
  shouldExportDir,
  toOsSpecificPath,
  toPosixPath
} from './functions';

/**
 * Validates if the given `uri` is valid to generate a barrel file and,
 * if so, generates a barrel file in it
 *
 * @param uri The selected Uri to generate the barrel file
 * @param recursive If the barrel files should be generated recursively
 * @returns A promise with the path where the barrel file will be written
 * @throws {Error} If the selected `uri` is not valid
 */
const validateAndGenerate = async (): Promise<string> => {
  let targetDir;

  if (isNil(get(Context.activePath, 'path'))) {
    targetDir = await getFolderNameFromDialog();

    if (isNil(targetDir)) {
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
 *
 * @param targetPath The target path of the barrel file
 * @returns A promise with the path of the written barrel file
 */
const generate = async (targetPath: string): Promise<string> => {
  // Selected target is in the current workspace
  // This could be optional
  const splitDir = targetPath.split('/');

  // If the user has set the promptName option and it is not the
  // recursive case, ask for the name
  let barrelFileName: string = splitDir[splitDir.length - 1];

  if (
    Context.activeType === GEN_TYPE.REGULAR &&
    getConfig(CONFIGURATIONS.values.PROMPT_NAME)
  ) {
    const result = await window.showInputBox({
      title: 'Barrel file name',
      prompt:
        'Enter the name of the barrel file without the extension. If no name is entered, the folder name will be used',
      placeHolder: 'Ex: index'
    });

    barrelFileName = result ? result : barrelFileName;
  }

  const files = [];
  const dirs = new Set();

  for (const curr of readdirSync(targetPath, { withFileTypes: true })) {
    if (curr.isFile()) {
      if (shouldExport(curr.name, barrelFileName)) {
        files.push(curr.name);
      }
    } else if (curr.isDirectory()) {
      if (shouldExportDir(curr.name)) {
        dirs.add(curr.name);
      }
    }
  }

  if (Context.activeType === GEN_TYPE.RECURSIVE && dirs.size > 0) {
    for (const d of dirs) {
      files.push(
        toPosixPath(await generate(`${targetPath}/${d}`)).split(
          `${targetPath}/`
        )[1]
      );
    }
  }

  // Sort files
  return writeBarrelFile(targetPath, barrelFileName, files.sort(fileSort));
};

export { validateAndGenerate };
