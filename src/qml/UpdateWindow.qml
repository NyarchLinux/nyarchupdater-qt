import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import org.kde.kirigami as Kirigami

Window {
    id: updateWindow
    width: 780
    height: 550
    title: "Nyarch Update"
    color: Kirigami.Theme.backgroundColor

    signal executeCommandRequested(string command)
    signal checkSuccessRequested(string command)

    function markSuccess(cmd) {
        for (let i = 0; i < stepsModel.count; i++) {
            if (stepsModel.get(i).cmd === cmd) {
                stepsModel.setProperty(i, "success", true);
                return;
            }
        }
    }

    function loadCommands(commands) {
        stepsModel.clear()
        for (let i = 0; i < commands.length; i++) {
            stepsModel.append({
                "label": commands[i].title || ("Step " + (i + 1)),
                "cmd":   commands[i].command   || "",
                "prettyCmd": commands[i].shown_command || commands[i].command || "",
                "description": commands[i].description || "",
                "image": commands[i].image || "",
                "required": !commands[i].skippable || false,
                "success": false
            });
        }
        carousel.currentIndex = 0;
    }

    ListModel {
        id: stepsModel
    }

    ColumnLayout {
        anchors.fill: parent
        Layout.fillWidth: true
        Layout.fillHeight: true

        Controls.SwipeView {
            id: carousel
            Layout.fillWidth: true
            Layout.fillHeight: true
            interactive: currentItem ? !currentItem.stepBlocking : true

            Repeater {
                model: stepsModel

                Item {
                    property bool stepBlocking: model.required && !model.success
                    
                    ColumnLayout {
                        anchors.fill: parent
                        anchors.margins: Kirigami.Units.largeSpacing
                        spacing: Kirigami.Units.largeSpacing

                        Image {
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            fillMode: Image.PreserveAspectFit
                            source: model.image !== "" ? model.image : ""

                            Rectangle {
                                anchors.fill: parent
                                color: "transparent"
                                visible: parent.status === Image.Error || parent.source == ""
                                Kirigami.Icon {
                                    anchors.centerIn: parent
                                    source: "system-run"
                                    width: 64; height: 64
                                }
                            }
                        }

                        Kirigami.Heading {
                            level: 2
                            text: model.label
                            Layout.alignment: Qt.AlignHCenter
                            Layout.fillWidth: true
                            horizontalAlignment: Text.AlignHCenter
                            Layout.fillHeight: false
                            wrapMode: Text.Wrap
                        }

                        Controls.Label {
                            text: model.description
                            wrapMode: Text.Wrap
                            horizontalAlignment: Text.AlignHCenter
                            Layout.fillWidth: true
                            Layout.maximumWidth: 400
                            Layout.alignment: Qt.AlignHCenter
                            Layout.fillHeight: false
                        }

                        Controls.Label {
                            visible: model.success
                            text: "Completed"
                            color: Kirigami.Theme.positiveTextColor
                            font.bold: true
                            Layout.alignment: Qt.AlignHCenter
                        }

                        Flow {
                            Layout.fillWidth: false
                            Layout.alignment: Qt.AlignHCenter
                            spacing: Kirigami.Units.smallSpacing

                            Controls.Button {
                                text: "Previous"
                                icon.name: "go-previous"
                                enabled: index > 0
                                onClicked: carousel.currentIndex = index - 1
                            }

                            Controls.Button {
                                text: "Show Cmd"
                                icon.name: "view-process-system"
                                onClicked: {
                                    const command = model.prettyCmd;
                                    if (command.length > 0) {
                                        if (typeof showCommandWindow !== "undefined") {
                                            showCommandWindow.loadCommand(command);
                                            showCommandWindow.show()
                                        } else {
                                            console.warn("showCommandWindow not defined")
                                        }
                                    }
                                }
                            }

                            Controls.Button {
                                text: "Execute"
                                icon.name: "system-run"
                                highlighted: model.required && !model.success
                                enabled: !model.success
                                onClicked: updateWindow.executeCommandRequested(model.cmd)
                            }

                            Controls.Button {
                                text: "Check Success"
                                icon.name: "task-complete"
                                visible: model.required && !model.success
                                highlighted: true
                                onClicked: updateWindow.checkSuccessRequested(model.cmd)
                            }

                            Controls.Button {
                                text: "Next"
                                icon.name: "go-next"
                                visible: index < carousel.count - 1
                                enabled: !stepBlocking
                                onClicked: carousel.currentIndex = index + 1
                            }
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