// Load system Qt plugins (Breeze style) before any Qt import
process.env.QT_PLUGIN_PATH = [
    process.env.QT_PLUGIN_PATH,
    "/usr/lib/qt6/plugins",
]
    .filter(Boolean)
    .join(":");
process.env.QT_STYLE_OVERRIDE = "breeze";

import { Application } from "./application";

const app = new Application();

app.start().catch((err: Error) => {
    console.error("Error starting application:", err);
    app.close();
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    app.close();
});
process.on("beforeExit", () => app.close());
process.on("exit", () => app.close());
