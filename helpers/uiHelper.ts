import * as vscode from 'vscode';

export async function showInputBox(prompt: string, defaultValue: string = ''): Promise<string | undefined> {
    return vscode.window.showInputBox({
        prompt,
        value: defaultValue,
        validateInput: (value) => {
            if (!value || value.trim() === '') {
                return 'Please enter a valid name';
            }
            if (!/^[a-zA-Z0-9\-_\s]+$/.test(value)) {
                return 'Name should only contain alphanumeric characters, hyphens, underscores, and spaces';
            }
            return null;
        }
    });
}

export async function showSelectFolderDialog(): Promise<string | undefined> {
    const options: vscode.OpenDialogOptions = {
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select Folder'
    };
    
    const result = await vscode.window.showOpenDialog(options);
    
    if (result && result.length > 0) {
        return result[0].fsPath;
    }
    
    return undefined;
}

export async function showProgressNotification<T>(
    title: string, 
    task: (progress: vscode.Progress<{ message?: string; increment?: number }>) => Promise<T>
): Promise<T> {
    return vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title,
            cancellable: false
        },
        task
    );
} 