import * as vscode from 'vscode';
import { createNewApp } from './commands/createNewApp';
import { runDoctor } from './commands/runDoctor';
import { buildAndDeploy } from './commands/buildAndDeploy';

export function activate(context: vscode.ExtensionContext) {
    
    const createNewAppCommand = vscode.commands.registerCommand('expo-tools.createNewApp', () => {
        createNewApp();
    });

    
    const runDoctorCommand = vscode.commands.registerCommand('expo-tools.runDoctor', () => {
        runDoctor();
    });

    const buildAndDeployCommand = vscode.commands.registerCommand('expo-tools.buildAndDeploy', () => {
        buildAndDeploy();
    });

    context.subscriptions.push(createNewAppCommand, runDoctorCommand, buildAndDeployCommand);
}

export function deactivate() {} 