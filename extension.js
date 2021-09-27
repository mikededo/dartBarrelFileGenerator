const { readdirSync, lstatSync, writeFile } = require('fs');
const _ = require('lodash');
const path = require('path');
const vscode = require('vscode');

const CONFIGURATIONS = {
  key: 'dartBarrelFileGenerator',
  values: {
    EXCLUDE_FREEZED: 'excludeFreezed',
    EXCLUDE_GENERATED: 'excludeGenerated',
  },
};

const REGEX = {
  /**
   * Used to check whether the current file name has a
   * dart file extension
   */
  dart: new RegExp('.*(.dart)$'),

  /**
   * Returns a regex tnhat will match if the filename has
   * the same name as the barrel file of the `folder` param
   *
   * @param {string} folder The folder name
   * @returns {RegExp}
   */
  base: (folder) => new RegExp(`^${folder}.dart$`),
};

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
    console.log(error);
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
 * @param {boolean} recursive Whether it should be recursive
 * @returns {Promise<string>}
 * @throws {Error}
 */
async function generate(targetPath, recursive = false) {
  // Selected target is in the current workspace
  // This could be optional
  const splitDir = targetPath.split('/');
  // The folder name
  const dirName = splitDir[splitDir.length - 1];

  const files = [];
  const dirs = new Set();

  for (const curr of readdirSync(targetPath, { withFileTypes: true })) {
    if (curr.isFile()) {
      if (shouldExport(curr.name, dirName)) {
        files.push(curr.name);
      }
    } else if (curr.isDirectory()) {
      dirs.add(curr.name);
    }
  }

  if (recursive && dirs.size > 0) {
    for (const d of dirs) {
      files.push(
        toPosixPath(await generate(`${targetPath}/${d}`, true)).split(
          `${targetPath}/`
        )[1]
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

/**
 * @param {string} posixPath
 * @param {string} dirName
 * @returns {boolean} Whether the file should be exported or not
 */
function shouldExport(posixPath, dirName) {
  if (REGEX.dart.test(posixPath) && !REGEX.base(dirName).test(posixPath)) {
    if (posixPath.endsWith('.freezed.dart')) {
      // Export only if files are not excluded
      return !getConfig(CONFIGURATIONS.values.EXCLUDE_FREEZED);
    } else if (posixPath.endsWith('.g.dart')) {
      // Export only if files are not excluded
      return !getConfig(CONFIGURATIONS.values.EXCLUDE_GENERATED);
    }
    console.log(posixPath);
    return true;
  }

  return false;
}

/**
 * @param {string} value
 * @returns {any} The value of the configuration (undefined if does not exist)
 */
function getConfig(value) {
  return vscode.workspace
    .getConfiguration()
    .get([CONFIGURATIONS.key, value].join('.'));
}

function deactivate() {}

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
