import {
    AlignmentFlag,
    Direction,
    QBoxLayout,
    QWidget,
} from "@nodegui/nodegui";
import { UpdatesPanel } from "./updates-panel";

export class MainPanel extends QWidget {
    panelLayout = new QBoxLayout(Direction.TopToBottom);
    private updatesPanel = new UpdatesPanel();

    constructor() {
        super();
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
