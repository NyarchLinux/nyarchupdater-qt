import { join } from "path";
import { paths } from "./paths";
import { exec } from "node:child_process";

export class KeyManager {
    public path = join(paths.data, "public.asc");
    public updatesLink = "https://nyarchlinux.moe/update.json";

    /**
     * Imports the nyarch linux GPG key from the app data path using gpg.
     */
    async importKey() {
        const command = `gpg --import "${this.path}"`;
        return new Promise<void>((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(
                        new Error(`Error importing GPG key: ${error.message}`),
                    );
                } else if (stderr) {
                    reject(new Error(`Error importing GPG key: ${stderr}`));
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Checks the GPG signature of the updates.json file by downloading it and verifying it with gpg. If the signature is valid, the promise resolves; otherwise, it rejects with an error.
     */
    async checkUpdatesSignature() {
        const downloadUpdatesJSONCommand = `rm -f ${paths.cache}/updates.json && curl -L -o ${paths.cache}/updates.json ${this.updatesLink}`;
        const verifySignatureCommand = `gpg --verify ${paths.cache}/updates.json`;

        return new Promise<void>((resolve, reject) => {
            exec(downloadUpdatesJSONCommand, (downloadError) => {
                if (downloadError) {
                    // we include a "tag: " prefix to know what part of the process the error came from, since both commands can produce stderr output
                    reject(
                        new Error(
                            `download: Error downloading updates.json: ${downloadError.message}`,
                        ),
                    );
                    return;
                }

                exec(verifySignatureCommand, (verifyError, stdout, stderr) => {
                    if (verifyError) {
                        reject(
                            new Error(
                                `verify: Error verifying GPG signature: ${verifyError.message}`,
                            ),
                        );
                    } else if (stderr) {
                        reject(
                            new Error(
                                `verify: GPG signature verification failed: ${stderr}`,
                            ),
                        );
                    } else {
                        resolve();
                    }
                });
            });
        });
    }
}
