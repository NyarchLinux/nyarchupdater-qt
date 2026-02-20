import { join } from "path";
import { paths } from "./paths";
import { execFile } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { ASSETS_PATH } from "./constants";

export class KeyManager {
    public path = join(ASSETS_PATH, "public.asc");
    public updatesLink = "https://nyarchlinux.moe/update.json";

    /**
     * Imports the nyarch linux GPG key from the app data path using gpg.
     */
    async importKey() {
        return new Promise<void>((resolve, reject) => {
            execFile("gpg", ["--import", this.path], (error) => {
                if (error) {
                    reject(
                        new Error(`Error importing GPG key: ${error.message}`),
                    );
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Downloads the updates.json file and its detached GPG signature (.sig),
     * then verifies the signature using gpg.
     */
    async checkUpdatesSignature() {
        const updatesFile = join(paths.cache, "updates.json");
        const signatureFile = join(paths.cache, "updates.json.sig");

        await mkdir(paths.cache, { recursive: true });
        await rm(updatesFile, { force: true });
        await rm(signatureFile, { force: true });

        await this.download(this.updatesLink, updatesFile);
        await this.download(this.updatesLink + ".sig", signatureFile);

        await new Promise<void>((resolve, reject) => {
            execFile(
                "gpg",
                ["--verify", signatureFile, updatesFile],
                (error) => {
                    if (error) {
                        reject(
                            new Error(
                                `verify: GPG signature verification failed: ${error.message}`,
                            ),
                        );
                    } else {
                        resolve();
                    }
                },
            );
        });
    }

    private download(url: string, dest: string): Promise<void> {
        return new Promise((resolve, reject) => {
            execFile("curl", ["-sfL", "-o", dest, url], (error) => {
                if (error) {
                    reject(
                        new Error(
                            `download: Error downloading ${url}: ${error.message}`,
                        ),
                    );
                } else {
                    resolve();
                }
            });
        });
    }
}
