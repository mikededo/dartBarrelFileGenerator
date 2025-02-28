import type { FocusedGenerations, GenerationType } from '@dbf/core';

import type { ExtensionContext } from 'vscode';
import { commands, Uri, window } from 'vscode';

import { init } from './extension.js';

export { deactivate } from './extension.js';

/**
 * Curried function that, from the given type of the generation,
 * it will set up the context with the `uri` received from the curried fn
 * and the given type
 */
const generate = (type: GenerationType) => async (uri: Uri) => {
  await init(uri, type);
};

const generateFocused = (type: FocusedGenerations) => async () => {
  const activeEditor = window.activeTextEditor;
  if (!activeEditor) {
    return;
  }

  const parent = Uri.joinPath(activeEditor.document.uri, '..');
  await generate(type)(parent);
};

export const activate = (context: ExtensionContext) => {
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
