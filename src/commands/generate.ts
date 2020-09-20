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
  GenerateHelper,
} from '../utils';

export const generateCurrentAndNested = (uri: Uri) =>
  _generateValidation(uri, true);

export const generateCurrent = (uri: Uri) => _generateValidation(uri, false);

/**
 * If the `Uri` passed is null or undefined, it will open a dialog box asking
 * the user to choose a folder. If the user chooses a folder out of the current
 * workspace it will show an error
 *
 * @param uri Uri recieved from vscode
 * @param recursive `true` will create barrel files for the nested folders and
 * add them to the top level barrel file
 */
export const _generateValidation = async (
  uri: Uri,
  recursive: boolean
): Promise<string | undefined> => {
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
      return await _generate(directory.toString(), workspacePath, recursive);
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

/**
 * Core function of the extension. Analizes the items in the directory and creates
 * the barrel file for the current or the current and its nested folders
 *
 * @param directory The directory we are working on
 * @param workspacePath Path of the workspace
 * @param recursive `true` will create barrel files for the nested folders and
 * add them to the top level barrel file
 */
async function _generate(
  directory: string,
  workspacePath: string,
  recursive: boolean
) {
  // The selected folder is inside the current project
  // Following dart naming convention, we have to use camelcase
  const folderName = getLastItemOfPath(directory.toString());
  const helper: GenerateHelper = new GenerateHelper(
    folderName,
    folderName.toLowerCase().split(' ').join('_'),
    await workspace.findFiles(`**\\${folderName}\\**`)
  );

  for (let value of helper.files) {
    let name: string;

    if (isSubFolderPath(directory, value.fsPath)) {
      // If the user only wants to create the barrel file only
      // in the selected folder
      if (!recursive) {
        continue;
      }

      const nestedFolderPath: string = getSubfolderFromPath(
        directory,
        value.fsPath
      );

      // Check if we already have gone into that folder recursively
      if (helper.isChecked(nestedFolderPath)) {
        continue;
      } else {
        helper.addChecked(nestedFolderPath);
      }

      // If we reach here => recursive == true
      let result = await _generate(nestedFolderPath, directory, true);

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
    if (!(name === helper.barrelFileName.concat('.dart')) && isDartFile(name)) {
      helper.addFileName(name);
    }
  }

  try {
    await generateBarrelFile(
      directory.toString(),
      helper.barrelFileName,
      helper.fileNames
    );

    return helper.barrelFileName;
  } catch (error) {
    window.showErrorMessage(error);
    return;
  }
}
