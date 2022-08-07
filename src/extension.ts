import { commands, ExtensionContext, Uri } from 'vscode';

import { Context, GenerationType } from './helpers';
import { init } from './helpers/extension';

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

/**
 * Curried function that, from the given type of the generation,
 * it will set up the context with the `uri` received from the curried fn
 * and the given type
 */
const generate = (type: GenerationType) => async (uri: Uri) => {
  Context.initGeneration({ path: uri, type: type });
  await init();
};

const deactivate = () => {
  Context.deactivate();
};

export { activate, deactivate, generate };
