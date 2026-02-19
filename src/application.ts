import { QApplication, QIcon } from "@nodegui/nodegui";
import { MainWindow } from "./windows/main";
import { paths } from "./utils/paths";
import { FIRST_RUN_PATH } from "./utils/constants";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { KeyManager } from "./utils/key-manager";
import { UpdatesManager } from "./utils/updates-manager";

export class Application {
    readonly name: string = "Nyarch Updater";

    public qApplication: QApplication = QApplication.instance();
    public iconPath: string = "assets/icon.png";
    public icon = new QIcon(this.iconPath);
    public window: MainWindow | null = null;
    public keyManager = new KeyManager();
    public updatesManager = new UpdatesManager(this);

    get firstStart() {
        return !existsSync(FIRST_RUN_PATH);
    }

    close() {
        this.qApplication.quit();
    }

    async start() {
        if (this.firstStart) {
            await this.handleFirstStart();
        }

        this.window = new MainWindow();
        this.window.show();
    }

    async handleFirstStart() {
        await writeFile(FIRST_RUN_PATH, "false");
        await this.keyManager.importKey();
    }
}
