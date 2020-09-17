import * as _ from 'lodash';
import { OpenDialogOptions, window } from 'vscode';

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
export const isDartFile = (path: string): boolean =>
  path.endsWith('.dart');
