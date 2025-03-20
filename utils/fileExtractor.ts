import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as child_process from 'child_process';

const exec = util.promisify(child_process.exec);

export async function extractZip(zipPath: string, targetDir: string): Promise<void> {
    // Check if target directory exists
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    
    try {
        // Use built-in expand command on Windows
        if (process.platform === 'win32') {
            // PowerShell's Expand-Archive command
            await exec(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${targetDir}' -Force"`);
        } else {
            // Use unzip command on Linux/macOS
            await exec(`unzip -o "${zipPath}" -d "${targetDir}"`);
        }
    } catch (error) {
        throw new Error(`Failed to extract zip file: ${error instanceof Error ? error.message : String(error)}`);
    }
} 