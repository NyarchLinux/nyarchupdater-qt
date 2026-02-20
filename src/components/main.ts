import {
    AlignmentFlag,
    Direction,
    QBoxLayout,
    QWidget,
} from "@nodegui/nodegui";
import { UpdatesPanel } from "./updates-panel";
import { Application } from "../application";

export class MainPanel extends QWidget {
    panelLayout = new QBoxLayout(Direction.TopToBottom);
    private updatesPanel;

    constructor(application: Application) {
        super();
        this.updatesPanel = new UpdatesPanel(application);
        this.init();
    }

    init() {
        this.panelLayout.setSpacing(0);
        this.panelLayout.setContentsMargins(0, 0, 0, 0);

        this.panelLayout.addStretch(1);
        this.panelLayout.addWidget(
            this.updatesPanel,
            0,
            AlignmentFlag.AlignHCenter,
        );
        this.panelLayout.addStretch(1);

        this.setLayout(this.panelLayout);
    }
}
