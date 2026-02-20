import QtQuick
import QtQuick.Layouts
import QtQuick.Controls as Controls
import org.kde.kirigami as Kirigami
import moe.nyarchlinux.nyarchupdaterqt 1.0

Kirigami.Page {
    title: "Nyarch Updater"

    ColumnLayout {
        anchors {
            top: parent.top
            left: parent.left
            right: parent.right
        }

        Controls.Label {
            textFormat: Text.RichText
            wrapMode: Text.WordWrap
            text: "A quick overview of your system updates"

            Layout.fillWidth: true
        }

        Controls.Label {
            text: "You have 5 pending Arch updates."
        }

        Controls.Button {
            text: "Check For Updates"
            icon.name: "system-run"

            onClicked: {
                UpdateManager.checkForUpdates()
            }
        }

        /*Controls.Button {
            text: "Start Update Process"
            icon.name: "system-run"

            onClicked: {
                myCarouselWindow.show();
            }
        }*/
    }
}