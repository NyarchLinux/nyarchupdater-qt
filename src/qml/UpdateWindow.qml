import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import org.kde.kirigami as Kirigami

Window {
    id: updateWindow
    width: 500
    height: 350
    title: "Update"

    onClosing: {
        console.log("Update window closed. Re-checking for updates.");
        backend.check_for_updates();
    }

    ColumnLayout {
        anchors.fill: parent

        // The SwipeView acts as your Carousel
        Controls.SwipeView {
            id: carousel
            Layout.fillWidth: true
            Layout.fillHeight: true

            /*Kirigami.Page {
                Column {
                    anchors.centerIn: parent
                    Controls.Label { text: "Step 1: Refreshing pacman mirrors..." }
                    Controls.BusyIndicator { running: true }
                }
            }

            Kirigami.Page {
                Column {
                    anchors.centerIn: parent
                    Controls.Label { text: "Step 2: Downloading packages..." }
                    Controls.ProgressBar { value: 0.5 }
                }
            }

            Kirigami.Page {
                Column {
                    anchors.centerIn: parent
                    Controls.Label { text: "Step 3: Installing..." }
                }
            }*/

            // Dynamically create pages based on the update steps in backend
        }

        Controls.PageIndicator {
            id: indicator
            Layout.alignment: Qt.AlignHCenter
            Layout.bottomMargin: Kirigami.Units.largeSpacing
            count: carousel.count
            currentIndex: carousel.currentIndex
        }
    }
}