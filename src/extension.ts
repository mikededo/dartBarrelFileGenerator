import { commands, ExtensionContext, Uri, window } from 'vscode';

import { Context, GEN_TYPE, validateAndGenerate } from './helpers';

/**
 * Activates the extension
 */
const activate = (context: ExtensionContext) => {
  // Generate current
  context.subscriptions.push(
    commands.registerCommand(
      'dartBarrelFileGenerator.generateCurrent',
      generateCurrent
    )
  );

  // Generate current and nested
  context.subscriptions.push(
    commands.registerCommand(
      'dartBarrelFileGenerator.generateCurrentAndNested',
      generateCurrentAndNested
    )
  );

  // Generate current with subfolders
  context.subscriptions.push(
    commands.registerCommand(
      'dartBarrelFileGenerator.generateCurrentWithSubfolders',
      () => {}
    )
  );
};

/**
 * To be called when the barrel file should be created in the current
 * folder only. If the given uri is not a folder,it will not generate
 * a barrel file
 *
 * @param uri The uri path in which to create the barrel file
 */
const generateCurrent = async (uri: Uri) => {
  Context.initGeneration({ path: uri, type: GEN_TYPE.REGULAR });

  try {
    window.showInformationMessage(
      'GDBF: Generated file!',
      await validateAndGenerate().then((s) => {
        Context.endGeneration();

        return s;
      })
    );
  } catch (error: any) {
    Context.onError(error);
    Context.endGeneration();

    window.showErrorMessage('GDBF: Error on generating the file', error);
  }
};

/**
 * To be called when the barrel file should be created recursively
 * starting from the given folder. If the given uri is not a folder,
 * it will not generate a barrel file
 *
 * @param uri The uri path in which to create the barrel file
 */
const generateCurrentAndNested = async (uri: Uri) => {
  Context.initGeneration({ path: uri, type: GEN_TYPE.RECURSIVE });

  try {
    window.showInformationMessage(
      'GDBF: Generated files!',
      await validateAndGenerate().then((s) => {
        Context.endGeneration();

        return s;
      })
    );
  } catch (error: any) {
    Context.onError(error);
    Context.endGeneration();

    window.showErrorMessage('GDBF: Error on generating the file', error);
  }
};

const deactivate = () => {
  Context.deactivate();
};

export { activate, deactivate, generateCurrent, generateCurrentAndNested };
