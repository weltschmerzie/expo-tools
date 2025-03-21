import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getWorkspaceFolders } from '../utils/workspace';

const execAsync = promisify(exec);

/**
 * Run 'expo doctor' command to diagnose any issues with the Expo project
 */
export async function runDoctor(): Promise<void> {
    try {
        // Check if we're in an Expo project
        const workspaceFolders = getWorkspaceFolders();
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        
        // Create output channel for doctor results
        const outputChannel = vscode.window.createOutputChannel('Expo Doctor');
        outputChannel.show(true);
        
        // Show progress notification
        outputChannel.appendLine('Running Expo doctor...');
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Running Expo doctor",
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Checking project configuration..." });
            
            try {
                // Run the expo doctor command
                const { stdout, stderr } = await execAsync('npx expo doctor', { 
                    cwd: workspaceRoot 
                });
                
                if (stderr) {
                    outputChannel.appendLine('\n🔴 ERRORS:');
                    outputChannel.appendLine(stderr);
                }
                
                if (stdout) {
                    outputChannel.appendLine('\n✅ RESULT:');
                    outputChannel.appendLine(stdout);
                }
                
                // Summary message
                if (!stderr) {
                    vscode.window.showInformationMessage('Expo diagnostics completed. See output for details.');
                } else {
                    vscode.window.showWarningMessage('Expo diagnostics completed with issues. See output for details.');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                outputChannel.appendLine('\n❌ FAILED TO RUN EXPO DOCTOR:');
                outputChannel.appendLine(errorMessage);
                vscode.window.showErrorMessage(`Failed to run Expo doctor: ${errorMessage}`);
            }
        });
        
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
} 