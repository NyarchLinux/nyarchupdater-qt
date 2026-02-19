import { Direction, QBoxLayout, QWidget } from "@nodegui/nodegui";
import { UpdateAccordion } from "./update-accordion";

export class UpdatesContainer extends QWidget {
    containerLayout = new QBoxLayout(Direction.TopToBottom);
    public archUpdatesWidget = new UpdateAccordion("Arch Updates");
    public nyarchUpdatesWidget = new UpdateAccordion("Nyarch Updates");

    constructor() {
        super();
        this.init();
    }

    init() {
        this.containerLayout.setSpacing(8);
        this.containerLayout.setContentsMargins(0, 0, 0, 0);
        this.containerLayout.addWidget(this.archUpdatesWidget);
        this.containerLayout.addWidget(this.nyarchUpdatesWidget);
        this.setLayout(this.containerLayout);
    }
}
