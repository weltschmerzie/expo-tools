import * as vscode from 'vscode';
import { cloneExpoTemplate } from '../git/gitHandler';
import { createWorkspaceFolder } from '../utils/workspace';
import { showInputBox } from '../helpers/uiHelper';

export async function createNewApp(): Promise<void> {
    try {
        const appName = await showInputBox('Enter your Expo application name', 'MyExpoApp');
        
        if (!appName) {
            vscode.window.showInformationMessage('App creation canceled');
            return;
        }

        const locationChoice = await vscode.window.showQuickPick(
            ['Create in new folder', 'Create in current folder'],
            { placeHolder: 'Choose where to create the app' }
        );

        if (!locationChoice) {
            vscode.window.showInformationMessage('App creation canceled');
            return;
        }

        let targetFolder: string | undefined;

        if (locationChoice === 'Create in new folder') {
            targetFolder = await createWorkspaceFolder(appName);
        } else {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage('No workspace is open. Please open a workspace first.');
                return;
            }
            targetFolder = workspaceFolders[0].uri.fsPath;
        }
        
        if (!targetFolder) {
            return;
        }
        
        vscode.window.showInformationMessage(`Creating new Expo app: ${appName}`);
        
        const success = await cloneExpoTemplate(targetFolder, appName);
        
        if (success) {
            vscode.window.showInformationMessage(`Successfully created Expo app: ${appName}`);
            
            const openFolder = await vscode.window.showInformationMessage(
                `Would you like to open ${appName} in a new window?`,
                'Yes', 'No'
            );
            
            if (openFolder === 'Yes') {
                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetFolder), true);
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create Expo app: ${error instanceof Error ? error.message : String(error)}`);
    }
} 