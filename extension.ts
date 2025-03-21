import * as vscode from 'vscode';
import { createNewApp } from './commands/createNewApp';
import { runDoctor } from './commands/runDoctor';

export function activate(context: vscode.ExtensionContext) {
    
    const createNewAppCommand = vscode.commands.registerCommand('expo-tools.createNewApp', () => {
        createNewApp();
    });

    
    const runDoctorCommand = vscode.commands.registerCommand('expo-tools.runDoctor', () => {
        runDoctor();
    });

    context.subscriptions.push(createNewAppCommand, runDoctorCommand);
}

export function deactivate() {} 