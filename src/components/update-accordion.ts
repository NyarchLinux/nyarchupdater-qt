import {
    AlignmentFlag,
    CursorShape,
    Direction,
    QBoxLayout,
    QFont,
    QFrame,
    QLabel,
    QToolButton,
    QWidget,
    WidgetEventTypes,
} from "@nodegui/nodegui";
import { Shape } from "@nodegui/nodegui/dist/lib/QtWidgets/QFrame";
import { ArrowType } from "@nodegui/nodegui/dist/lib/QtEnums/ArrowType";

export class UpdateAccordion extends QWidget {
    private mainLayout = new QBoxLayout(Direction.TopToBottom);
    private headerWidget = new QWidget();
    private arrow = new QToolButton();
    private titleLabel = new QLabel();
    private content = new QFrame();
    private contentLayout = new QBoxLayout(Direction.TopToBottom);
    private expanded = false;
    private title: string;

    constructor(title = "Section") {
        super();
        this.title = title;
        this.init();
    }

    private init() {
        this.mainLayout.setSpacing(0);
        this.mainLayout.setContentsMargins(0, 0, 0, 0);

        // Header layout: [arrow] [centered title]
        const headerLayout = new QBoxLayout(Direction.LeftToRight);
        headerLayout.setContentsMargins(4, 4, 4, 4);
        headerLayout.setSpacing(0);

        // Native arrow icon
        this.arrow.setArrowType(ArrowType.RightArrow);
        this.arrow.setFixedSize(20, 20);
        this.arrow.setEnabled(false); // just a visual indicator, clicks go to the whole header

        // Title label centered
        this.titleLabel.setText(this.title);
        this.titleLabel.setAlignment(AlignmentFlag.AlignCenter);
        const titleFont = new QFont("default", 10);
        titleFont.setBold(true);
        this.titleLabel.setFont(titleFont);

        headerLayout.addWidget(this.arrow);
        headerLayout.addWidget(this.titleLabel, 1); // stretch=1 to take remaining space
        this.headerWidget.setLayout(headerLayout);
        this.headerWidget.setCursor(CursorShape.PointingHandCursor);
        this.headerWidget.addEventListener(
            WidgetEventTypes.MouseButtonPress,
            () => this.toggle(),
        );

        // Content area (hidden by default)
        this.contentLayout.setSpacing(4);
        this.contentLayout.setContentsMargins(14, 8, 14, 8);
        this.content.setLayout(this.contentLayout);
        this.content.setFrameShape(Shape.StyledPanel);
        this.content.hide();

        this.mainLayout.addWidget(this.headerWidget);
        this.mainLayout.addWidget(this.content);
        this.setLayout(this.mainLayout);
    }

    private toggle() {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.arrow.setArrowType(ArrowType.DownArrow);
            this.content.show();
        } else {
            this.arrow.setArrowType(ArrowType.RightArrow);
            this.content.hide();
        }
    }

    /** Add a widget inside the accordion content area */
    addContentWidget(widget: QWidget) {
        this.contentLayout.addWidget(widget);
    }

    /** Convenience: add a simple text item */
    addItem(text: string) {
        const label = new QLabel();
        label.setText(text);
        this.contentLayout.addWidget(label);
    }
}
