const { lstatSync, writeFile } = require('fs');
const _ = require('lodash');
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Generate Current
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'dart-barrel-file-generator.generateCurrent',
      generateCurrent
    )
  );

  // Generate Current and Nested
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'dart-barrel-file-generator.generateCurrentAndNested',
      generateCurrentAndNested
    )
  );
}

/**
 * @param {vscode.Uri} uri
 */
async function generateCurrent(uri) {
  try {
    vscode.window.showInformationMessage(
      'GDBF: Generated file!',
      await validateAndGenerate(uri, true)
    );
  } catch (error) {
    vscode.window.showErrorMessage('GDBF: Error on generating the file', error);
  }
}

/**
 * @param {vscode.Uri} uri
 */
async function generateCurrentAndNested(uri) {
  try {
    vscode.window.showInformationMessage(
      'GDBF: Generated files!',
      await validateAndGenerate(uri, true)
    );
  } catch (error) {
    vscode.window.showErrorMessage('GDBF: Error on generating the file', error);
  }
}

/**
 * @param {vscode.Uri} uri
 * @param {boolean} recursive
 * @returns {Promise<string>}
 * @throws {Error}
 */
async function validateAndGenerate(uri, recursive = false) {
  let targetDir;
  if (_.isNil(_.get(uri, 'path'))) {
    targetDir = await getFolderNameFromInput();

    if (!lstatSync(targetDir).isDirectory()) {
      throw Error('Select a directory!');
    }
  } else {
    if (!lstatSync(uri.path).isDirectory()) {
      throw Error('Select a directory!');
    }

    targetDir = uri.path;
  }

  const currDir = vscode.workspace.workspaceFolders[0].uri.path;
  if (!targetDir.includes(currDir)) {
    throw Error('Select a folder from the workspace');
  } else {
    return generate(targetDir, recursive);
  }
}

/**
 * @param {string} targetPath
 * @param {boolean} recursive
 * @returns {Promise<string>}
 * @throws {Error}
 */
async function generate(targetPath, recursive = false) {
  // Selected target is in the current workspace
  // This could be optional
  let splitDir = targetPath.split('/');
  const dirName = splitDir[splitDir.length - 1];

  const wksFiles = await vscode.workspace.findFiles(`**/${dirName}/**`);
  const files = [];
  const dirs = [];

  for (const t of wksFiles) {
    if (lstatSync(t.path).isFile()) {
      if (t.path.endsWith('.dart') && !t.path.endsWith(`${dirName}.dart`)) {
        if (t.path.split(`/`).length - splitDir.length == 1) {
          // Get only dart files that are nested to the current folder
          files.push(t.path);
        } else if (recursive) {
          // Get all subfolders since we want to create it recursively
          const folderName = t.path.split(targetPath)[1].split('/')[1];
          dirs.push(targetPath.concat(`/${folderName}`));
        }
      }
    }
  }

  if (recursive && dirs.length > 0) {
    for (const d of dirs) {
      generate(d, true);
    }
  }

  // Sort files
  files.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  let exports = '';
  for (const t of files) {
    exports = `${exports}export '${t.substring(t.lastIndexOf('/') + 1)}';\n`;
  }

  const barrelFile = `${targetPath}/${dirName}.dart`;
  return new Promise(async (resolve) => {
    writeFile(barrelFile, exports, 'utf8', (error) => {
      if (error) {
        throw Error(error.message);
      }

      resolve(barrelFile);
    });
  });
}

/**
 * @returns {Promise<string>}
 */
async function getFolderNameFromInput() {
  const checkboxOptions = {
    canSelectMany: false,
    canSelectFiles: false,
    canSelectFolders: true,
    openLabel: 'Select the folder in which you want to create the barrel file',
  };

  return vscode.window.showOpenDialog(checkboxOptions).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }

    // The selected input is in the first array position
    return uri[0].path;
  });
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  generateCurrent,
  generateCurrentAndNested,
  validateAndGenerate,
  generate,
};
