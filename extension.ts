import * as vscode from 'vscode';
import { createNewApp } from './commands/createNewApp';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('expo-tools.createNewApp', () => {
        createNewApp();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {} 