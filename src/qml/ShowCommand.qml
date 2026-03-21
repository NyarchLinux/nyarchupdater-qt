import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import org.kde.kirigami as Kirigami

Window {
    id: updateWindow
    width: 500
    height: 350
    title: "Update Command"
    color: Kirigami.Theme.backgroundColor

    function loadCommand(command) {
        commandLabel.text = command;
    }

    ColumnLayout {
        anchors.fill: parent
        Layout.fillWidth: true
        Layout.fillHeight: true
        spacing: Kirigami.Units.largeSpacing
        anchors.margins: Kirigami.Units.largeSpacing

        Controls.ScrollView {
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            Controls.ScrollBar.horizontal.policy: Controls.ScrollBar.AsNeeded
            Controls.ScrollBar.vertical.policy: Controls.ScrollBar.AsNeeded

            Controls.TextArea {
                id: commandLabel
                font.family: "monospace"
                readOnly: true
                selectByMouse: true
                wrapMode: Text.NoWrap
                background: null
            }
        }
    }
}