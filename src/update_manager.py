from PySide6.QtCore import QObject, Slot
from PySide6.QtQml import QmlElement, QmlSingleton

QML_IMPORT_NAME = "moe.nyarchlinux.nyarchupdaterqt"
QML_IMPORT_MAJOR_VERSION = 1


@QmlElement
@QmlSingleton
class UpdateManager(QObject):
    def __init__(self, parent=None):
        super().__init__(parent)

    @Slot()
    def checkForUpdates(self):
        self.checkForArchUpdates()
        self.checkForNyarchUpdates()

    def checkForArchUpdates(self):
        from utils import spawn

        try:
            output = spawn(["checkupdates"])
            print("Arch updates available:")
            print(output)
        except RuntimeError as e:
            print(f"Error checking for Arch updates: {e}")

    def checkForNyarchUpdates(self):
        from utils import spawn

        try:
            output = spawn(["nyarchupdater", "--check"])
            print("Nyarch updates available:")
            print(output)
        except RuntimeError as e:
            print(f"Error checking for Nyarch updates: {e}")