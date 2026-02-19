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
