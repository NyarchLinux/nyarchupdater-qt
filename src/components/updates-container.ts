import { Direction, QBoxLayout, QWidget } from "@nodegui/nodegui";
import { UpdateDropdown } from "./update-dropdown";

export class UpdatesContainer extends QWidget {
    containerLayout = new QBoxLayout(Direction.TopToBottom);
    public archUpdatesWidget = new UpdateDropdown();
    public nyarchUpdatesWidget = new UpdateDropdown();

    constructor() {
        super();
        this.init();
    }

    init() {
        this.containerLayout.setSpacing(0);
        this.containerLayout.setContentsMargins(0, 0, 0, 0);
        this.containerLayout.addWidget(this.archUpdatesWidget);
        this.containerLayout.addWidget(this.nyarchUpdatesWidget);
        this.setLayout(this.containerLayout);
    }
}
