import { lstatSync } from 'fs';
import * as _ from 'lodash';

import { Uri, window, workspace } from 'vscode';
import {
  getFolderNameFromInput,
  getLastItemOfPath,
  generateBarrelFile,
} from '../utils';

export const generateFromFolder = async (uri: Uri) => {
  // Command running via input
  let directory;
  if (_.isNil(_.get(uri, 'fsPath'))) {
    directory = await getFolderNameFromInput();

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
      const folderName = getLastItemOfPath(directory.toString());

      const files = await workspace.findFiles(`**\\**${folderName}\\*`);
      const fileNames: string[] = [];
      files.forEach((value: Uri) =>
        fileNames.push(getLastItemOfPath(value.fsPath))
      );

      try {
        await generateBarrelFile(directory.toString(), folderName, fileNames);
      } catch (error) {
        console.log(error);
      }
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
