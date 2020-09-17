import { commands, ExtensionContext } from 'vscode';
import { generate } from './commands';

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('extension.generateBarrelFile', generate)
  );
}
