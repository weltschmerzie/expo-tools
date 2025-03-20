import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { simpleGit, SimpleGit } from 'simple-git';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const EXPO_TEMPLATE_REPO = 'https://github.com/expo/expo-template-default';

export async function cloneExpoTemplate(targetPath: string, appName: string): Promise<boolean> {
    const progress = reportProgress(`Creating Expo app: ${appName}`);
    
    try {
        await progress.report({ message: 'Downloading template...' });
        
        // Create a temporary directory for cloning
        const tempDir = path.join(os.tmpdir(), `expo-temp-${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });
        
        try {
            // Clone to temporary directory first
            await cloneRepository(EXPO_TEMPLATE_REPO, tempDir);
            
            // Copy files to target directory
            await copyDirectory(tempDir, targetPath);
            
            // Customize the project
            await progress.report({ message: 'Customizing project...' });
            await customizeProject(targetPath, appName);
            
            // Ask to run npm install
            const runNpmInstall = await vscode.window.showInformationMessage(
                'Would you like to install dependencies now?',
                'Yes', 'No'
            );
            
            if (runNpmInstall === 'Yes') {
                await progress.report({ message: 'Installing dependencies...' });
                await runNpmInstallCommand(targetPath);
            }
            
            return true;
        } finally {
            // Clean up temporary directory
            if (fs.existsSync(tempDir)) {
                fs.rmSync(tempDir, { recursive: true, force: true });
            }
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error creating Expo template: ${error instanceof Error ? error.message : String(error)}`);
        return false;
    } finally {
        progress.complete();
    }
}

async function runNpmInstallCommand(targetPath: string): Promise<void> {
    try {
        await execAsync('npm install', { cwd: targetPath });
        vscode.window.showInformationMessage('Dependencies installed successfully!');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to install dependencies: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function cloneRepository(repoUrl: string, targetPath: string): Promise<void> {
    const git: SimpleGit = simpleGit();
    await git.clone(repoUrl, targetPath);
    
    // Remove Git history
    const gitFolder = path.join(targetPath, '.git');
    if (fs.existsSync(gitFolder)) {
        fs.rmSync(gitFolder, { recursive: true, force: true });
    }
}

async function copyDirectory(source: string, target: string): Promise<void> {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    }
}

async function customizeProject(targetPath: string, appName: string): Promise<void> {
    // Update app.json
    const appJsonPath = path.join(targetPath, 'app.json');
    if (fs.existsSync(appJsonPath)) {
        const appJsonContent = fs.readFileSync(appJsonPath, 'utf8');
        const appJson = JSON.parse(appJsonContent);
        
        appJson.expo.name = appName;
        appJson.expo.slug = appName.toLowerCase().replace(/\s+/g, '-');
        
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    }
    
    // Update package.json
    const packageJsonPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);
        
        // Update name to match user input
        packageJson.name = appName.toLowerCase().replace(/\s+/g, '-');
        
        // Update description if it exists
        if (packageJson.description) {
            packageJson.description = `${appName} - Expo application`;
        }
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }
}

function reportProgress(title: string): vscode.Progress<{ message?: string }> & { complete: () => void } {
    let resolvePromise: () => void;
    const promise = new Promise<void>(resolve => {
        resolvePromise = resolve;
    });

    const progress = {
        report: ({ message }: { message?: string }) => {
            vscode.window.setStatusBarMessage(`${title}: ${message || ''}`);
        },
        complete: () => {
            vscode.window.setStatusBarMessage('');
            resolvePromise();
        }
    };

    vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title,
            cancellable: false
        },
        () => promise
    );

    return progress;
} 