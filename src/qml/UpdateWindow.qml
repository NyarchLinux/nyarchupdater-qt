import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import org.kde.kirigami as Kirigami

Window {
    id: updateWindow
    width: 500
    height: 350
    title: "Nyarch Update"

    // Call this from outside to populate the carousel dynamically
    function loadCommands(commands) {
        stepsModel.clear()
        for (var i = 0; i < commands.length; i++) {
            stepsModel.append({
                "label": commands[i].label || ("Step " + (i + 1)),
                "cmd":   commands[i].cmd   || ""
            })
        }
        carousel.currentIndex = 0
    }

    ListModel {
        id: stepsModel
    }

    ColumnLayout {
        anchors.fill: parent

        Controls.SwipeView {
            id: carousel
            Layout.fillWidth: true
            Layout.fillHeight: true

            Repeater {
                model: stepsModel

                Kirigami.Page {
                    ColumnLayout {
                        anchors.centerIn: parent
                        spacing: Kirigami.Units.largeSpacing

                        Kirigami.Heading {
                            level: 2
                            text: model.label
                            Layout.alignment: Qt.AlignHCenter
                        }

                        Controls.Label {
                            text: model.cmd
                            font.family: "monospace"
                            wrapMode: Text.Wrap
                            Layout.alignment: Qt.AlignHCenter
                        }

                        Controls.BusyIndicator {
                            Layout.alignment: Qt.AlignHCenter
                            running: true
                            visible: carousel.currentIndex === index
                        }
                    }
                }
            }
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