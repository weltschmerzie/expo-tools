import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function createWorkspaceFolder(appName: string): Promise<string | undefined> {
    // Get the workspace folder path
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open. Please open a workspace first.');
        return undefined;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const targetFolderPath = path.join(rootPath, appName);

    // Check if directory already exists
    if (fs.existsSync(targetFolderPath)) {
        const choice = await vscode.window.showWarningMessage(
            `Folder "${appName}" already exists. Do you want to overwrite it?`,
            'Yes', 'No'
        );
        
        if (choice !== 'Yes') {
            vscode.window.showInformationMessage('App creation canceled');
            return undefined;
        }
        
        try {
            fs.rmSync(targetFolderPath, { recursive: true, force: true });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to remove existing directory: ${error instanceof Error ? error.message : String(error)}`);
            return undefined;
        }
    }

    // Create the directory
    try {
        fs.mkdirSync(targetFolderPath, { recursive: true });
        return targetFolderPath;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create directory: ${error instanceof Error ? error.message : String(error)}`);
        return undefined;
    }
}

export function getWorkspaceFolders(): readonly vscode.WorkspaceFolder[] {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder found');
    }
    return workspaceFolders;
} 