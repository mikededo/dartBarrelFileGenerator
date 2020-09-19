import { lstatSync } from 'fs';
import * as _ from 'lodash';

import { Uri, window, workspace } from 'vscode';
import {
  getFolderNameFromInput,
  getLastItemOfPath,
  generateBarrelFile,
  isDartFile,
  isDirectory,
  isSubFolderPath,
  getSubfolderFromPath,
} from '../utils';

/**
 * Generates the barrel file. If the given `Uri` is null, it will
 * open an `OpenDialogOptions` to choose the folder of the barrel file.
 * It will only accept the selected folder if it is from the curernt
 * workspace
 */
export const generate = async (uri: Uri): Promise<string | undefined> => {
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
    if (!isDirectory(uri.fsPath)) {
      window.showErrorMessage('You must select a folder.');
      return;
    }

    directory = uri.fsPath;
  }

  if (!_.isNil(workspace.workspaceFolders)) {
    let workspacePath = workspace.workspaceFolders[0].uri.fsPath;

    if (directory.includes(workspacePath)) {
      return await _generate(directory.toString(), workspacePath);
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

async function _generate(directory: string, workspacePath: string) {
  // The selected folder is inside the current project
  // Following dart naming convention, we have to use camelcase
  const folderName = getLastItemOfPath(directory.toString());
  const barrelFileName = folderName.toLowerCase().split(' ').join('_');
  const files = await workspace.findFiles(`**\\**${folderName}\\*`);
  const fileNames: string[] = [];
  const checkedFolders = new Set();

  for (let value of files) {
    const currentFolderPath = workspacePath.concat('\\', folderName);
    let name: string;

    if (isSubFolderPath(currentFolderPath, value.fsPath)) {
      const nestedFolderPath: string = getSubfolderFromPath(
        currentFolderPath,
        value.fsPath
      );

      // Check if we already have gone into that folder recursively
      if (checkedFolders.has(nestedFolderPath)) {
        continue;
      } else {
        checkedFolders.add(nestedFolderPath);
      }

      let result = await _generate(nestedFolderPath, currentFolderPath);

      if (!_.isNil(result)) {
        name = getLastItemOfPath(nestedFolderPath).concat('/', result, '.dart');
      } else {
        window.showErrorMessage(
          'An error ocurred. Try again or send an issue in the repo!'
        );
        return;
      }
    } else {
      name = getLastItemOfPath(value.fsPath);
    }

    // We have to skip items which are not dart files and in case the
    // user is updating the barrel file, we have to skip the barrel file
    // to avoid a circular import
    if (!(name === barrelFileName.concat('.dart')) && isDartFile(name)) {
      fileNames.push(name);
    }
  }

  try {
    await generateBarrelFile(directory.toString(), barrelFileName, fileNames);

    return barrelFileName;
  } catch (error) {
    window.showErrorMessage(error);
    return;
  }
}
