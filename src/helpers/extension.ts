import { lstatSync, readdirSync, writeFile } from 'fs';
import { get, isNil } from 'lodash';
import { workspace } from 'vscode';

import Context from './context';
import {
  fileSort,
  getFolderNameFromDialog,
  shouldExport,
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
 * @param recursive If it should generate barrel files recursively
 * @returns A promise with the path of the written barrel file
 */
const generate = async (targetPath: string): Promise<string> => {
  // Selected target is in the current workspace
  // This could be optional
  const splitDir = targetPath.split('/');
  // The folder name
  const dirName = splitDir[splitDir.length - 1];

  const files = [];
  const dirs = new Set();

  for (const curr of readdirSync(targetPath, { withFileTypes: true })) {
    if (curr.isFile()) {
      if (shouldExport(curr.name, dirName)) {
        files.push(curr.name);
      }
    } else if (curr.isDirectory()) {
      dirs.add(curr.name);
    }
  }

  if (Context.activeType && dirs.size > 0) {
    for (const d of dirs) {
      files.push(
        toPosixPath(await generate(`${targetPath}/${d}`)).split(
          `${targetPath}/`
        )[1]
      );
    }
  }

  // Sort files
  return writeBarrelFile(targetPath, dirName, files.sort(fileSort));
};

export { validateAndGenerate };
