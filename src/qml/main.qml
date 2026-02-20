import QtQuick
import QtQuick.Layouts
import QtQuick.Controls as Controls
import org.kde.kirigami as Kirigami
import "pages"
import moe.nyarchlinux.nyarchupdaterqt 1.0

Kirigami.ApplicationWindow {
    id: root

    title: "Nyarch Updater"

    minimumWidth: Kirigami.Units.gridUnit * 40
    minimumHeight: Kirigami.Units.gridUnit * 40
    width: minimumWidth
    height: minimumHeight

    Component.onCompleted: {
        UpdateManager.checkForUpdates()
    }

    pageStack.initialPage: MainPage {}
    pageStack.columnView.columnResizeMode: Kirigami.ColumnView.SingleColumn

    function navigateTo(pageUrl) {
        if (pageStack.depth > 1 && pageStack.currentItem &&
            pageStack.currentItem.objectName === pageUrl) {
            return;
        }
        pageStack.pop(pageStack.get(0));

        var page = pageStack.push(Qt.resolvedUrl(pageUrl));
        page.objectName = pageUrl;
    }

    UpdateWindow {
        id: myCarouselWindow
    }

    globalDrawer: Kirigami.GlobalDrawer
    {
        actions: [
            Kirigami.Action {
                text: "Updates"
                icon.name: "system-software-update"
                onTriggered: pageStack.pop(pageStack.get(0))
            },
            Kirigami.Action {
                text: "FAQ & Common Issues"
                icon.name: "help-browser"
                onTriggered: navigateTo("pages/FAQ.qml")
            },
            Kirigami.Action {
                text: "About Nyarch Updater"
                icon.name: "help-about"
                onTriggered: navigateTo("pages/About.qml")
            },
            Kirigami.Action {
                text: "Quit"
                icon.name: "application-exit-symbolic"
                shortcut: StandardKey.Quit
                onTriggered: Qt.quit()
            }
        ]
    }
}
