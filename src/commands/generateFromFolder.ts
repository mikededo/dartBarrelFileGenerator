import { lstat, lstatSync } from 'fs';
import * as _ from 'lodash';

import { OpenDialogOptions, Uri, window, workspace } from 'vscode';

export const generateFromFolder = async (uri: Uri) => {
  // Command running via input
  let directory;
  if (_.isNil(_.get(uri, 'fsPath'))) {
    directory = await _getFolderNameFromInput();

    if (_.isNil(directory)) {
      window.showErrorMessage('No folder was seleted. Please select a folder');
      return;
    }
  } else {
    // Clicked item is not a folder
    if (!lstatSync(uri.fsPath).isDirectory()) {
      window.showErrorMessage('You must select a folder.');
      return;
    }

    directory = uri.fsPath;
  }

  if (!_.isNil(workspace.workspaceFolders)) {
    let workspacePath = workspace.workspaceFolders[0].uri.fsPath;

    if (directory.includes(workspacePath)) {
      // The selected folder is inside the current project
    } else {
      // The selected folder is outside the current project
      window.showErrorMessage(
        'The selected directory is from outside the working directory.\nSelect a folder from the current directory'
      );
    }
  } else {
    // There's no opened project
    window.showErrorMessage(
      'In order to use the extension, open a workspace or a folder'
    );
    return;
  }
};

async function _getFolderNameFromInput(): Promise<String | undefined> {
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
}
