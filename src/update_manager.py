from PySide6.QtCore import QObject, Signal, Slot, Property, QThread
from PySide6.QtQml import QmlElement, QmlSingleton
import json
from constants import CACHE_PATH
from utils import spawn, pspawn

from keymanager import KeyManager

QML_IMPORT_NAME = "moe.nyarchlinux.nyarchupdaterqt"
QML_IMPORT_MAJOR_VERSION = 1

class _CheckWorker(QThread):
    """Runs update checks off the main thread."""
    archResult = Signal(list)
    nyarchResult = Signal(str, list)
    noUpdates = Signal()
    error = Signal(str)

    def run(self):
        self._checkArch()
        self._checkNyarch()

    def _checkArch(self):
        try:
            output = spawn(["checkupdates"])
            packages = [line for line in output.strip().splitlines() if line]
            self.archResult.emit(packages)
        except RuntimeError:
            self.archResult.emit([])

    def _checkNyarch(self):
        # noinspection PyUnresolvedReferences
        status = KeyManager.verify_signature()
        if not status["status"]:
            self.error.emit(f"Signature verification failed: {status.get('reason', 'unknown')}\n\nThis could indicate a potential security issue. Please check the news channel in Nyarch for any announcements regarding security updates or key changes.")
            return

        updates_json_path = CACHE_PATH / "updates.json"
        if not updates_json_path.exists():
            self.error.emit("updates.json file does not exist.")
            return

        try:
            with open(updates_json_path, "r") as f:
                json_content = json.load(f)
        except Exception as e:
            self.error.emit(f"Error reading updates.json: {e}")
            return

        try:
            with open("/version", "r") as f:
                current_version = f.read().strip()
        except Exception as e:
            self.error.emit(f"Error reading /version file: {e}")
            return

        latest = json_content.get(current_version)
        if not latest:
            self.noUpdates.emit()
            return

        version = latest.get("version", "unknown")
        commands = latest.get("updates", [])
        self.nyarchResult.emit(version, commands)


@QmlElement
@QmlSingleton
class UpdateManager(QObject):
    # Signals to notify QML
    archUpdatesReady = Signal(list)
    nyarchUpdateReady = Signal(str, list)
    noUpdatesAvailable = Signal()
    errorOccurred = Signal(str)
    loadingChanged = Signal()

    def __init__(self, parent=None):
        super().__init__(parent)
        self._loading = False
        self._worker = None

    def _get_loading(self):
        return self._loading

    def _set_loading(self, value):
        if self._loading != value:
            self._loading = value
            self.loadingChanged.emit()

    loading = Property(bool, _get_loading, _set_loading, notify=loadingChanged)

    # Slots

    @Slot()
    def checkForUpdates(self):
        if self._loading:
            return
        self._set_loading(True)
        print("Starting update check...")

        self._worker = _CheckWorker(self)
        self._worker.archResult.connect(self.archUpdatesReady)
        self._worker.nyarchResult.connect(self.nyarchUpdateReady)
        self._worker.noUpdates.connect(self.noUpdatesAvailable)
        self._worker.error.connect(self.errorOccurred)
        self._worker.finished.connect(self._onWorkerDone)
        self._worker.start()

    def _onWorkerDone(self):
        self._set_loading(False)
        self._worker.deleteLater()
        self._worker = None

    @Slot()
    def runArchUpdate(self):
        try:
            pspawn(["konsole", "-e", "sudo pacman -Syu --noconfirm"])
        except RuntimeError as e:
            self.errorOccurred.emit(f"Arch update failed: {e}")