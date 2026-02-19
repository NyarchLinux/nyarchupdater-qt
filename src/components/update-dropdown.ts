import { QWidget } from "@nodegui/nodegui";

export class UpdateDropdown extends QWidget {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.setMinimumHeight(100);
    }
}
