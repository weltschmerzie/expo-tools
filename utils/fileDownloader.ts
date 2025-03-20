import * as fs from 'fs';
import axios from 'axios';

export async function downloadFile(url: string, targetPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Create the file stream
        const fileStream = fs.createWriteStream(targetPath);
        
        // Use axios for downloading
        axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        })
        .then(response => {
            response.data.pipe(fileStream);
            
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
            
            fileStream.on('error', (err) => {
                // Clean up the file if there's an error
                fs.unlink(targetPath, () => {
                    reject(err);
                });
            });
        })
        .catch(error => {
            reject(error);
        });
    });
} 