import { commands, ExtensionContext } from 'vscode';
import { generateFromFolder } from './commands';

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('extension.generateFromFolder', generateFromFolder)
  );
}
