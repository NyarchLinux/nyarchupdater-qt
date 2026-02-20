import { Application } from "../application";
import { readFile } from "node:fs/promises";
import { paths } from "./paths";
import { exec } from "node:child_process";
import { join } from "node:path";

interface UpdateError {
    type: "download" | "verify" | "unknown";
    message: string;
}

interface ArchUpdate {
    name: string;
    current: string;
    latest: string;
}

export class UpdatesManager {
    private application: Application;

    constructor(application: Application) {
        this.application = application;
    }

    /**
     * Checks for Nyarch Linux release updates.
     * It downloads the new updates.json file from Nyarch's servers containing all updates, verifies its GPG signature and then checks for updates.
     */
    async checkNyarchUpdates() {
        const downloadError = await this.application.keyManager
            .checkUpdatesSignature()
            .catch((err: Error) => {
                console.error("Error downloading updates file:", err);
                const type = err.message.startsWith("download:")
                    ? "download"
                    : err.message.startsWith("verify:")
                      ? "verify"
                      : "unknown";
                return { type, message: err.message };
            });

        if (downloadError) {
            this.handleUpdateError(downloadError);
            return;
        }

        const raw = await readFile(
            join(paths.cache, "updates.json"),
            "utf-8",
        ).catch((err: Error) => {
            console.error("Error reading updates.json:", err);
            return null;
        });
        const json: Record<string, string> | null = raw
            ? JSON.parse(raw)
            : null;

        if (!json) {
            this.handleUnknownError(
                "Failed to read updates.json after successful signature verification.",
            );
            return;
        }

        const currentVersion = await this.getCurrentVersion();
        const latestVersion = currentVersion ? json[currentVersion] : null;

        return {
            currentVersion,
            latestVersion: latestVersion || currentVersion, // if latestVersion is null, it is most likely because there is no update available
        };
    }

    async checkArchUpdates(): Promise<ArchUpdate[] | null> {
        const result: UpdateError | any[] = await new Promise((resolve) => {
            const command = "/usr/bin/checkupdates";
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("Error checking Arch updates:", error);
                    resolve({
                        type: "unknown",
                        message: `Error checking Arch updates: ${error.message}`,
                    });
                } else if (stderr) {
                    console.error("Error checking Arch updates:", stderr);
                    resolve({
                        type: "unknown",
                        message: `Error checking Arch updates: ${stderr}`,
                    });
                } else {
                    const updates = stdout
                        .trim()
                        .split("\n")
                        .filter((line) => line);
                    resolve(updates);
                }
            });
        });

        if (Array.isArray(result)) {
            // using flatMap to filter out lines that don't match the updates regex
            return result.flatMap((line) => {
                const match = line.match(/(\S+)\s(\S+)\s->\s(\S+)/);
                if (match) {
                    return [
                        {
                            name: match[1],
                            current: match[2],
                            latest: match[3],
                        },
                    ];
                } else {
                    return [];
                }
            });
        } else {
            this.handleUpdateError(result);
            return null;
        }
    }

    /**
     * Checks for updates on both arch repos and nyarch releases.
     */
    async checkForUpdates() {
        return {
            nyarch: await this.checkNyarchUpdates(),
            arch: await this.checkArchUpdates(),
        };
    }

    /**
     * Reads the current version of Nyarch Linux from the /version file. If the file cannot be read, it returns null.
     */
    async getCurrentVersion() {
        const versionFilePath = "/version";
        const version = await readFile(versionFilePath, "utf-8").catch(
            (err: Error) => {
                console.error("Error reading current version:", err);
                return null;
            },
        );
        return version ? version.trim() : null;
    }

    /**
     * Handles errors that occur during the update checking process.
     * @param error An object containing the type and message of the error.
     * @private
     */
    private handleUpdateError(error: { type: string; message: string }) {
        if (error.type === "download") {
            this.handleDownloadError(error.message);
        } else if (error.type === "verify") {
            this.handleVerificationError(error.message);
        } else {
            this.handleUnknownError(error.message);
        }
    }

    // TODO: implement these
    private handleDownloadError(message: string) {}
    private handleVerificationError(message: string) {}
    private handleUnknownError(message: string) {}
}
