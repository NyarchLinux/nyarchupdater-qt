import {
    QMainWindow,
    QStackedWidget,
    WidgetEventTypes,
} from "@nodegui/nodegui";
import { Application } from "../application";
import { MainPanel } from "../components/main";

export class MainWindow extends QMainWindow {
    private application: Application;
    private root = new QStackedWidget(this);

    constructor(application: Application) {
        super();
        this.application = application;
        this.init();
    }

    init() {
        this.setWindowTitle("Nyarch Updater");
        this.setWindowIcon(this.application.icon);
        this.setMinimumSize(500, 800);
        this.setCentralWidget(this.root);

        this.root.addWidget(new MainPanel());

        this.addEventListener(WidgetEventTypes.Close, () => {
            this.application.close();
        });
    }
}
