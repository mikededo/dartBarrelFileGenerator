import type { ExtensionContext } from 'vscode';
import type { FocusedGenerations, GenerationType } from './helpers';

import { commands, Uri, window } from 'vscode';
import { Context, init } from './helpers';
import { FOCUSED_TO_REGULAR } from './helpers/constants';

/**
 * Curried function that, from the given type of the generation,
 * it will set up the context with the `uri` received from the curried fn
 * and the given type
 */
const generate = (type: GenerationType) => async (uri: Uri) => {
  Context.initGeneration({ path: uri, type });
  await init();
};

const generateFocused = (type: FocusedGenerations) => async () => {
  const activeEditor = window.activeTextEditor;
  if (!activeEditor) {
    Context.onError('No active editor');
    return;
  }

  const parent = Uri.joinPath(activeEditor.document.uri, '..');
  await generate(FOCUSED_TO_REGULAR[type])(parent);
};

const deactivate = () => {
  Context.deactivate();
};

/**
 * Activates the extension
 */
const activate = (context: ExtensionContext) => {
  // Generate current
  context.subscriptions.push(
    commands.registerCommand(
      'dartBarrelFileGenerator.generateCurrent',
      generate('REGULAR')
    )
  );
  // For current folder
  context.subscriptions.push(
    commands.registerCommand(
      'dartBarrelFileGenerator.generateFocusedParent',
      generateFocused('REGULAR_FOCUSED')
    )
  );

  // Generate current with subfolders
  context.subscriptions.push(
    commands.registerCommand(
      'dartBarrelFileGenerator.generateCurrentWithSubfolders',
      generate('REGULAR_SUBFOLDERS')
    )
  );

  // Generate current and nested
  context.subscriptions.push(
    commands.registerCommand(
      'dartBarrelFileGenerator.generateCurrentAndNested',
      generate('RECURSIVE')
    )
  );
};

export { activate, deactivate, generate };
