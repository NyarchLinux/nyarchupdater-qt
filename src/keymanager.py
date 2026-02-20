from PySide6.QtCore import QObject, Slot
from PySide6.QtQml import QmlElement, QmlSingleton

from constants import ASSETS_PATH, CACHE_PATH
from utils import spawn

QML_IMPORT_NAME = "moe.nyarchlinux.nyarchupdaterqt"
QML_IMPORT_MAJOR_VERSION = 1

_KEY_PATH = ASSETS_PATH / "public.asc"
_UPDATES_JSON_LINK = "https://nyarchlinux.moe/update.json"
_UPDATES_JSON_PATH = CACHE_PATH / "updates.json"
_UPDATES_JSON_SIG_PATH = _UPDATES_JSON_PATH.with_name(_UPDATES_JSON_PATH.stem + ".json.sig")


@QmlElement
@QmlSingleton
class KeyManager(QObject):

    def __init__(self, parent=None):
        super().__init__(parent)

    @staticmethod
    def import_key():
        try:
            spawn(["gpg", "--import", str(_KEY_PATH)])
            print("GPG key imported successfully.")
        except RuntimeError as e:
            print(f"Error importing GPG key: {e}")

    @staticmethod
    def verify_updates_json() -> dict:
        if not _UPDATES_JSON_PATH.exists() or not _UPDATES_JSON_SIG_PATH.exists():
            return {"status": False, "reason": "updates.json or updates.json.sig file does not exist."}

        try:
            spawn(["gpg", "--verify", str(_UPDATES_JSON_SIG_PATH), str(_UPDATES_JSON_PATH)])
            return {"status": True}
        except RuntimeError as e:
            return {"status": False, "reason": f"Invalid signature: {e}"}

    @staticmethod
    def fetch_updates_json() -> dict:
        _UPDATES_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
        try:
            spawn(["curl", "--fail", "-sS", "-o", str(_UPDATES_JSON_PATH), _UPDATES_JSON_LINK])
            return {"status": True}
        except RuntimeError as e:
            return {"status": False, "reason": f"Error fetching updates.json: {e}"}

    @staticmethod
    def fetch_updates_json_signature() -> dict:
        try:
            spawn(["curl", "--fail", "-sS", "-o", str(_UPDATES_JSON_SIG_PATH), f"{_UPDATES_JSON_LINK}.sig"])
            return {"status": True}
        except RuntimeError as e:
            return {"status": False, "reason": f"Error fetching updates.json signature: {e}"}

    @staticmethod
    def verify_signature() -> dict:
        # noinspection PyUnresolvedReferences
        result = KeyManager.fetch_updates_json()
        if not result["status"]:
            return result

        # noinspection PyUnresolvedReferences
        result = KeyManager.fetch_updates_json_signature()
        if not result["status"]:
            return result

        # noinspection PyUnresolvedReferences
        return KeyManager.verify_updates_json()

    # QML Slots
    @Slot()
    def doImportKey(self):
        # noinspection PyUnresolvedReferences
        KeyManager.import_key()

    @Slot()
    def doVerifySignature(self):
        # noinspection PyUnresolvedReferences
        KeyManager.verify_signature()
