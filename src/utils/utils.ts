import { statSync } from 'fs';
import * as _ from 'lodash';
import { split } from 'lodash';
import { OpenDialogOptions, Uri, window } from 'vscode';

/**
 * Obtains a folder path from a `OpenDialogOptions`
 */
export const getFolderNameFromInput = async (): Promise<String | undefined> => {
  const checkboxOptions: OpenDialogOptions = {
    canSelectMany: false,
    canSelectFiles: false,
    canSelectFolders: true,
    openLabel: 'Select the folder in which you want to create the barrel file',
  };

  return window.showOpenDialog(checkboxOptions).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }

    // The selected input is in the first array position
    return uri[0].fsPath;
  });
};

/**
 * Returns the last item of a path (the folder name or the file + the extension)
 *
 * @param path Path to obtain the last item of
 */
export const getLastItemOfPath = (path: string): string => {
  return path.split('\\').reverse()[0];
};

/**
 * To know if a path is a dart file
 *
 * @param path The file to check
 */
export const isDartFile = (path: string): boolean => path.endsWith('.dart');

/**
 * Returns true if `path` is a directory
 */
export const isDirectory = (path: string): boolean =>
  statSync(path).isDirectory();

/**
 * Checks if path is a nested folder in `currentPath`
 *
 * @param currentPath Top level path
 * @param path Path to check if it is nested to `currentPath`
 */
export const isSubFolderPath = (currentPath: string, path: string): boolean => {
  if (!path.startsWith(currentPath)) {
    throw new Error(`${path} is not inside ${currentPath}`);
  }

  return path.split(`${currentPath}\\`)[1].split('\\').length > 1;
};

/**
 * `path` must contain `currentPath`.
 * Returns the name of the first folder of `path` that is nested in the
 * `currentPath`
 * @param currentPath Top level path
 * @param path Path nested to `currentPath`
 */
export const getSubfolderFromPath = (
  currentPath: string,
  path: string
): string => {
  const folderName = path.split(currentPath)[1].split('\\')[1];
  return currentPath.concat('\\', folderName);
};

/**
 * @class Helper class to control the files and the chekced folders.
 * Mainly used for the recursiveness.
 */
export class GenerateHelper {
  folderName: string;
  barrelFileName: string;
  files: Uri[];
  fileNames: string[];
  checkedFolders: Set<string>;

  constructor(folderName: string, barrelFileName: string, files: Uri[]) {
    this.folderName = folderName;
    this.barrelFileName = barrelFileName;
    this.files = files;

    // Other variables
    this.fileNames = [];
    this.checkedFolders = new Set<string>();
  }

  addChecked(folderPath: string) {
    this.checkedFolders.add(folderPath);
  }

  isChecked(fileName: string): boolean {
    return this.checkedFolders.has(fileName);
  }

  addFileName(fileName: string) {
    this.fileNames.push(fileName);
  }
}
