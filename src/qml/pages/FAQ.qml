import QtQuick
import QtQuick.Layouts
import QtQuick.Controls as Controls
import org.kde.kirigami as Kirigami

Kirigami.Page {
    title: "FAQ & Common Issues"

    ColumnLayout {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        spacing: Kirigami.Units.largeSpacing * 2

        Kirigami.Heading {
            text: "Frequently Asked Questions / Common Issues"
            level: 1
            Layout.fillWidth: true
            wrapMode: Text.WordWrap
        }

        ColumnLayout {
            Layout.fillWidth: true
            spacing: Kirigami.Units.largeSpacing

            Kirigami.Heading {
                text: "Q: Why is the update process slow?"
                level: 3
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
            }
            Controls.Label {
                Layout.fillWidth: true
                textFormat: Text.RichText
                wrapMode: Text.WordWrap
                text: "A: The update process may take some time due to various factors such as network speed, server load, and the number of packages being updated. Please be patient and ensure you have a stable internet connection."
            }
        }
    }
}