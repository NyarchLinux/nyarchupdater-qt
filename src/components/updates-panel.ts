import {
    AlignmentFlag,
    Direction,
    QBoxLayout,
    QFont,
    QLabel,
    QWidget,
} from "@nodegui/nodegui";
import { UpdatesContainer } from "./updates-container";

export class UpdatesPanel extends QWidget {
    panelLayout = new QBoxLayout(Direction.TopToBottom);
    private updatesContainer = new UpdatesContainer();

    constructor() {
        super();
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
        this.setLayout(this.panelLayout);
    }
}
