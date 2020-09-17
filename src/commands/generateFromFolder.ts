import { lstatSync } from 'fs';
import * as _ from 'lodash';

import { Uri, window, workspace } from 'vscode';
import {
  getFolderNameFromInput,
  getLastItemOfPath,
  generateBarrelFile,
  isDartFile,
} from '../utils';

/**
 * Generates the barrel file. If the given `Uri` is null, it will
 * open an `OpenDialogOptions` to choose the folder of the barrel file.
 * It will only accept the selected folder if it is from the curernt
 * workspace
 */
export const generate = async (uri: Uri) => {
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
      // Following dart naming convention, we have to use camelcase
      const folderName = getLastItemOfPath(directory.toString());
      const barrelFileName = folderName.toLowerCase().split(' ').join('_');
      const files = await workspace.findFiles(`**\\**${folderName}\\*`);
      const fileNames: string[] = [];

      files.forEach((value: Uri) => {
        const name = getLastItemOfPath(value.fsPath);

        // We have to skip items which are not dart files and in case the
        // user is updating the barrel file, we have to skip the barrel file
        // to avoid a circular import
        if (!(name === barrelFileName.concat('.dart')) && isDartFile(name)) {
          fileNames.push(name);
        }
      });

      try {
        await generateBarrelFile(
          directory.toString(),
          barrelFileName,
          fileNames
        );
      } catch (error) {
        window.showErrorMessage(error);
        return;
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
