import QtQuick
import QtQuick.Layouts
import QtQuick.Controls as Controls
import org.kde.kirigami as Kirigami
import moe.nyarchlinux.nyarchupdaterqt 1.0

Kirigami.Page {
    id: mainPage
    title: "Nyarch Updater"

    property int archCount: 0
    property string nyarchVersion: ""
    property var nyarchCommands: []
    property string errorMessage: ""

    Connections {
        target: UpdateManager

        function onArchUpdatesReady(packages) {
            archCount = packages.length
            archList.model = packages
            errorMessage = ""
        }

        function onNyarchUpdateReady(version, commands) {
            nyarchVersion = version
            nyarchCommands = commands
            errorMessage = ""
        }

        function onNoUpdatesAvailable() {
            nyarchVersion = ""
            nyarchCommands = []
        }

        function onErrorOccurred(message) {
            errorMessage = message
        }
    }

    ColumnLayout {
        id: content
        anchors {
            top: parent.top
            left: parent.left
            right: parent.right
        }
        spacing: Kirigami.Units.largeSpacing

        Kirigami.InlineMessage {
            Layout.fillWidth: true
            type: Kirigami.MessageType.Error
            text: errorMessage
            visible: errorMessage.length > 0
        }


        Kirigami.Heading {
            level: 3
            text: archCount > 0
                ? archCount + " Arch package update(s) available"
                : "No Arch updates available."
        }

        ListView {
            id: archList
            Layout.fillWidth: true
            Layout.preferredHeight: Math.min(contentHeight, Kirigami.Units.gridUnit * 12)
            visible: archCount > 0
            clip: true

            delegate: Controls.ItemDelegate {
                width: archList.width
                text: modelData
            }
        }

        Controls.Button {
            text: "Update Arch Packages"
            icon.name: "system-software-update"
            visible: archCount > 0
            onClicked: UpdateManager.runArchUpdate()
        }

        Kirigami.Separator {
            Layout.fillWidth: true
        }

        Kirigami.Heading {
            level: 3
            text: nyarchVersion.length > 0
                ? "Nyarch release " + nyarchVersion + " available!"
                : "No Nyarch updates available."
        }

        Controls.Button {
            text: "Start Nyarch Update"
            icon.name: "system-run"
            visible: nyarchVersion.length > 0
            onClicked: {
                myCarouselWindow.loadCommands(nyarchCommands)
                myCarouselWindow.show()
            }
        }

        Kirigami.Separator {
            Layout.fillWidth: true
        }


        Controls.Button {
            text: "Check For Updates"
            icon.name: "view-refresh"
            enabled: !UpdateManager.loading
            onClicked: UpdateManager.checkForUpdates()
        }
    }

    // Fullscreen loading overlay
    Rectangle {
        anchors.fill: parent
        anchors.margins: -Kirigami.Units.gridUnit * 2
        color: Qt.rgba(0, 0, 0, 0.4)
        visible: UpdateManager.loading
        z: 999

        Controls.BusyIndicator {
            anchors.centerIn: parent
            running: UpdateManager.loading
            width: Kirigami.Units.gridUnit * 2
            height: width
        }
    }
}