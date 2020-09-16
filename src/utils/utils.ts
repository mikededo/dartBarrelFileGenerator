import * as _ from 'lodash';
import { OpenDialogOptions, window } from 'vscode';

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

export const getLastItemOfPath = (path: string) => {
  return path.split('\\').reverse()[0];
};
