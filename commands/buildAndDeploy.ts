import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getWorkspaceFolders } from '../utils/workspace';

const execAsync = promisify(exec);

/**
 * Available build platforms for Expo apps
 */
enum BuildPlatform {
    ios = 'ios',
    android = 'android',
    web = 'web'
}

/**
 * Available build types for Expo apps
 */
enum BuildType {
    development = 'development',
    preview = 'preview',
    production = 'production'
}

/**
 * Expo build and deploy command implementation
 */
export async function buildAndDeploy(): Promise<void> {
    try {
        // Check if we're in an Expo project
        const workspaceFolders = getWorkspaceFolders();
        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        
        // Create output channel for build results
        const outputChannel = vscode.window.createOutputChannel('Expo Build & Deploy');
        outputChannel.show(true);
        
        // Show platform selection
        const selectedPlatform = await vscode.window.showQuickPick(
            [
                { label: 'iOS', description: 'Build for iOS devices' },
                { label: 'Android', description: 'Build for Android devices' },
                { label: 'Web', description: 'Build for Web platform' }
            ],
            { placeHolder: 'Select build platform' }
        );
        
        if (!selectedPlatform) {
            return; // User canceled
        }
        
        // Show build type selection
        const selectedBuildType = await vscode.window.showQuickPick(
            [
                { label: 'Development', description: 'Build for testing during development' },
                { label: 'Preview', description: 'Build for internal testing' },
                { label: 'Production', description: 'Build for store submission' }
            ],
            { placeHolder: 'Select build type' }
        );
        
        if (!selectedBuildType) {
            return; // User canceled
        }
        
        // Map selections to enum values
        const platform = selectedPlatform.label.toLowerCase() as BuildPlatform;
        const buildType = selectedBuildType.label.toLowerCase() as BuildType;
        
        // Start building
        outputChannel.appendLine(`Starting Expo build for ${platform} (${buildType})...`);
        
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Building Expo app for ${platform}`,
            cancellable: false
        }, async (progress) => {
            progress.report({ message: "Preparing build environment..." });
            
            try {
                // Prepare build command based on platform and type
                let buildCommand = `npx expo build:${platform}`;
                
                // Add options based on build type
                switch (buildType) {
                    case BuildType.development:
                        buildCommand += ' --dev';
                        break;
                    case BuildType.preview:
                        buildCommand += ' --release-channel preview';
                        break;
                    case BuildType.production:
                        buildCommand += ' --release-channel production';
                        break;
                }
                
                // For iOS, prompt for build type
                if (platform === BuildPlatform.ios) {
                    const iosBuildType = await vscode.window.showQuickPick(
                        ['archive', 'simulator'],
                        { placeHolder: 'Select iOS build type' }
                    );
                    
                    if (!iosBuildType) {
                        return; // User canceled
                    }
                    
                    buildCommand += ` --type ${iosBuildType}`;
                }
                
                // For Android, prompt for build type
                if (platform === BuildPlatform.android) {
                    const androidBuildType = await vscode.window.showQuickPick(
                        ['apk', 'app-bundle'],
                        { placeHolder: 'Select Android build type' }
                    );
                    
                    if (!androidBuildType) {
                        return; // User canceled
                    }
                    
                    buildCommand += ` --type ${androidBuildType}`;
                }
                
                progress.report({ message: "Building project..." });
                outputChannel.appendLine(`Executing: ${buildCommand}`);
                
                // Execute build command
                const { stdout, stderr } = await execAsync(buildCommand, { 
                    cwd: workspaceRoot,
                    maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large build outputs
                });
                
                if (stderr) {
                    outputChannel.appendLine('\n⚠️ BUILD WARNINGS/ERRORS:');
                    outputChannel.appendLine(stderr);
                }
                
                if (stdout) {
                    outputChannel.appendLine('\n📋 BUILD OUTPUT:');
                    outputChannel.appendLine(stdout);
                }
                
                // Check for success indicators in output
                const isSuccess = stdout.includes('Successfully built') || 
                                stdout.includes('Build finished') ||
                                !stderr;
                
                if (isSuccess) {
                    outputChannel.appendLine('\n✅ BUILD COMPLETED SUCCESSFULLY');
                    vscode.window.showInformationMessage(`Expo ${platform} build completed successfully!`);
                    
                    // Offer deployment options based on platform
                    if (platform === BuildPlatform.web) {
                        const shouldDeploy = await vscode.window.showInformationMessage(
                            'Would you like to deploy this web build?',
                            'Yes', 'No'
                        );
                        
                        if (shouldDeploy === 'Yes') {
                            await handleWebDeployment(workspaceRoot, outputChannel);
                        }
                    } else {
                        vscode.window.showInformationMessage(
                            `Your ${platform} build has completed. Follow the Expo CLI instructions for next steps.`
                        );
                    }
                } else {
                    outputChannel.appendLine('\n❌ BUILD FAILED');
                    vscode.window.showErrorMessage(`Expo ${platform} build failed. Check the output for details.`);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                outputChannel.appendLine('\n❌ BUILD PROCESS ERROR:');
                outputChannel.appendLine(errorMessage);
                vscode.window.showErrorMessage(`Build failed: ${errorMessage}`);
            }
        });
        
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Handle web deployment options
 */
async function handleWebDeployment(workspaceRoot: string, outputChannel: vscode.OutputChannel): Promise<void> {
    const deployTarget = await vscode.window.showQuickPick(
        [
            { label: 'Expo Hosting', description: 'Deploy to Expo hosting service' },
            { label: 'GitHub Pages', description: 'Deploy to GitHub Pages' },
            { label: 'Netlify', description: 'Deploy to Netlify' },
            { label: 'Vercel', description: 'Deploy to Vercel' }
        ],
        { placeHolder: 'Select deployment target' }
    );
    
    if (!deployTarget) {
        return; // User canceled
    }
    
    outputChannel.appendLine(`\nPreparing deployment to ${deployTarget.label}...`);
    
    try {
        let deployCommand = '';
        
        switch (deployTarget.label) {
            case 'Expo Hosting':
                deployCommand = 'npx expo publish:web';
                break;
            case 'GitHub Pages':
                deployCommand = 'npx gh-pages -d web-build';
                break;
            case 'Netlify':
                deployCommand = 'npx netlify deploy --dir=web-build';
                break;
            case 'Vercel':
                deployCommand = 'npx vercel web-build';
                break;
        }
        
        outputChannel.appendLine(`Executing: ${deployCommand}`);
        
        const { stdout, stderr } = await execAsync(deployCommand, { 
            cwd: workspaceRoot 
        });
        
        if (stderr) {
            outputChannel.appendLine('\n⚠️ DEPLOYMENT WARNINGS/ERRORS:');
            outputChannel.appendLine(stderr);
        }
        
        if (stdout) {
            outputChannel.appendLine('\n📋 DEPLOYMENT OUTPUT:');
            outputChannel.appendLine(stdout);
        }
        
        // Check for success indicators in output
        const isSuccess = stdout.includes('successfully') || 
                        stdout.includes('deployed') ||
                        !stderr;
        
        if (isSuccess) {
            outputChannel.appendLine('\n✅ DEPLOYMENT COMPLETED SUCCESSFULLY');
            vscode.window.showInformationMessage(`Deployment to ${deployTarget.label} completed successfully!`);
        } else {
            outputChannel.appendLine('\n❌ DEPLOYMENT FAILED');
            vscode.window.showErrorMessage(`Deployment to ${deployTarget.label} failed. Check the output for details.`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        outputChannel.appendLine('\n❌ DEPLOYMENT PROCESS ERROR:');
        outputChannel.appendLine(errorMessage);
        vscode.window.showErrorMessage(`Deployment failed: ${errorMessage}`);
    }
} 