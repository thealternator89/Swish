import { exec } from 'child_process';

export function execAsync(command: string) {
    return new Promise((resolve, reject) =>
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            if (stderr) {
                reject(stderr);
            }
            resolve(stdout);
        })
    );
}
