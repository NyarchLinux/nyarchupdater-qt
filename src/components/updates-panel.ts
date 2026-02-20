import {
    AlignmentFlag,
    Direction,
    QBoxLayout,
    QButtonGroup,
    QFont,
    QLabel,
    QPushButton,
    QWidget,
} from "@nodegui/nodegui";
import { UpdatesContainer } from "./updates-container";
import { Application } from "../application";

export class UpdatesPanel extends QWidget {
    panelLayout = new QBoxLayout(Direction.TopToBottom);
    private updatesContainer = new UpdatesContainer();
    application: Application;

    constructor(application: Application) {
        super();
        this.application = application;
        this.init();
    }

    init() {
        this.panelLayout.setSpacing(48);
        this.panelLayout.setContentsMargins(24, 24, 24, 24);

        this.setMinimumSize(400, 0);
        this.setMaximumSize(500, 16777215);

        const box = new QBoxLayout(Direction.TopToBottom);
        box.setSpacing(4);

        const title = new QLabel();
        title.setText("Nyarch Updater");
        title.setAlignment(AlignmentFlag.AlignHCenter);
        const titleFont = new QFont("default", 18);
        titleFont.setBold(true);
        title.setFont(titleFont);
        box.addWidget(title);

        const subtitle = new QLabel();
        subtitle.setText("A quick overview of your updates");
        subtitle.setAlignment(AlignmentFlag.AlignHCenter);
        subtitle.setEnabled(false); // uses the "disabled" palette color — gives a subdued/gray look natively
        box.addWidget(subtitle);
        this.panelLayout.addLayout(box);

        this.panelLayout.addWidget(this.updatesContainer);

        //make a button to click to check for updates
        const buttonBox = new QPushButton();
        buttonBox.setText("Check for updates");
        buttonBox.setFixedWidth(150);
        buttonBox.addEventListener("clicked", async () => {
            const updates = await this.application
                .checkForUpdates()
                .catch((err: Error) => {
                    console.error("Error checking for updates:", err);
                });
            console.log("Updates found:", updates);
        });
        this.panelLayout.addWidget(buttonBox, 0, AlignmentFlag.AlignHCenter);

        this.setLayout(this.panelLayout);
    }
}
