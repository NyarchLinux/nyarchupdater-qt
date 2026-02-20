from PySide6.QtCore import QObject, Slot
from PySide6.QtQml import QmlElement, QmlSingleton
import json
from constants import CACHE_PATH

from keymanager import KeyManager

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
        # noinspection PyUnresolvedReferences
        status = KeyManager.verify_signature()
        if not status["status"]:
            print(f"Error verifying updates.json signature: {status['reason']}")
            return

        # open the json file
        updates_json_path = CACHE_PATH / "updates.json"
        if not updates_json_path.exists():
            print("Error: updates.json file does not exist.")
            return


        json_content = None
        try:
            with open(updates_json_path, "r") as f:
                json_content = json.load(f)
        except Exception as e:
            print(f"Error reading updates.json: {e}")
            return

        # read the /version file
        current_version = None
        try:
            with open("/version", "r") as f:
                current_version = f.read().strip()
        except Exception as e:
            print(f"Error reading /version file: {e}")
            return

        latest = json_content.get(current_version)
        if not latest:
            print("No updates available.")
            return

        print(f"Nyarch updates available: {latest['version']}")