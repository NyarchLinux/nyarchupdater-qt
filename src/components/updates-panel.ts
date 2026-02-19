import { Direction, QBoxLayout, QLabel, QWidget } from "@nodegui/nodegui";
import { UpdatesContainer } from "./updates-container";

export class UpdatesPanel extends QWidget {
    panelLayout = new QBoxLayout(Direction.TopToBottom);
    private updatesContainer = new UpdatesContainer();

    constructor() {
        super();
        this.init();
    }

    init() {
        this.panelLayout.setSpacing(24);
        this.panelLayout.setContentsMargins(0, 0, 0, 0);

        const title = new QLabel();
        title.setText("Nyarch Updater");
        title.setInlineStyle("font-size: 24px; font-weight: bold;");
        this.panelLayout.addWidget(title);

        const subtitle = new QLabel();
        subtitle.setText("A quick overview of your updates");
        subtitle.setInlineStyle("font-size: 14px; color: gray;");
        this.panelLayout.addWidget(subtitle);

        this.panelLayout.addWidget(this.updatesContainer);
        this.setLayout(this.panelLayout);
    }
}
