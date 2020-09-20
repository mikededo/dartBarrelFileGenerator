import { commands, ExtensionContext } from 'vscode';
import { generateCurrent, generateCurrentAndNested } from './commands';

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(
      'extension.generateCurrentAndNested',
      generateCurrentAndNested
    ),
    commands.registerCommand('extension.generateCurrent', generateCurrent)
  );
}
