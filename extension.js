const { lstatSync, writeFile } = require('fs');
const _ = require('lodash');
const path = require('path');
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
      await validateAndGenerate(uri, false)
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

    targetDir = toPosixPath(targetDir);

    if (!lstatSync(targetDir).isDirectory()) {
      throw Error('Select a directory!');
    }
  } else {
    if (!lstatSync(toPosixPath(uri.fsPath)).isDirectory()) {
      throw Error('Select a directory!');
    }

    targetDir = toPosixPath(uri.fsPath);
  }

  const currDir = toPosixPath(vscode.workspace.workspaceFolders[0].uri.fsPath);
  if (!targetDir.includes(currDir)) {
    throw Error('Select a folder from the workspace');
  } else {
    return generate(targetDir, recursive);
  }
}

/**
 * @param {string} targetPath Has to be in posix style
 * @param {boolean} recursive
 * @returns {Promise<string>}
 * @throws {Error}
 */
async function generate(targetPath, recursive = false) {
  // Selected target is in the current workspace
  // This could be optional
  let splitDir = targetPath.split('/');
  const dirName = splitDir[splitDir.length - 1];

  const wksFiles = await vscode.workspace.findFiles(
    `**${path.sep}${dirName}${path.sep}**`
  );
  const files = [];
  const dirs = new Set();

  for (const t of wksFiles) {
    const posixPath = toPosixPath(t.fsPath);
    if (lstatSync(posixPath).isFile()) {
      if (
        posixPath.endsWith('.dart') &&
        !posixPath.endsWith(`${dirName}.dart`)
      ) {
        if (posixPath.split(`/`).length - splitDir.length == 1) {
          // Get only dart files that are nested to the current folder
          files.push(posixPath.substring(posixPath.lastIndexOf('/') + 1));
        } else if (recursive) {
          // Get all subfolders since we want to create it recursively
          var targetFilePathParts = posixPath.split(targetPath);
          if (targetFilePathParts.length > 1) {
            var targetFileFolderParts = targetFilePathParts[1].split('/');
            if (targetFileFolderParts.length > 1) {
              const folderName = targetFileFolderParts[1];
              dirs.add(targetPath.concat(`/${folderName}`));
            }
          }
        }
      }
    }
  }

  if (recursive && dirs.size > 0) {
    for (const d of dirs) {
      files.push(
        toPosixPath(await generate(d, true)).split(`${targetPath}/`)[1]
      );
    }
  }

  // Sort files
  files.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  let exports = '';
  for (const t of files) {
    exports = `${exports}export '${t}';\n`;
  }

  const barrelFile = `${targetPath}/${dirName}.dart`;
  return new Promise(async (resolve) => {
    writeFile(toPlatformSpecificPath(barrelFile), exports, 'utf8', (error) => {
      if (error) {
        throw Error(error.message);
      }

      resolve(toPlatformSpecificPath(barrelFile));
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

/**
 * @param {string} pathLike
 * @returns {string}
 */
function toPosixPath(pathLike) {
  return pathLike.split(path.sep).join(path.posix.sep);
}

/**
 * @param {string} posixPath
 * @returns {string}
 */
function toPlatformSpecificPath(posixPath) {
  return posixPath.split(path.posix.sep).join(path.sep);
}

exports.activate = activate;

function deactivate() { }

module.exports = {
  activate,
  deactivate,
  generateCurrent,
  generateCurrentAndNested,
  validateAndGenerate,
  generate,
  toPosixPath,
  toPlatformSpecificPath,
};
