#!/usr/bin/env python3

import os
import sys
import signal
from pathlib import Path
from PySide6.QtCore import QUrl
from PySide6.QtGui import QGuiApplication, QIcon
from PySide6.QtQml import QQmlApplicationEngine
# noinspection PyUnresolvedReferences
from KCoreAddons import KAboutData, KAboutLicense
from constants import DATA_PATH, CONFIG_PATH, CACHE_PATH
from keymanager import KeyManager
from update_manager import UpdateManager  # noqa: F401

_FIRST_START_FILE = Path(DATA_PATH) / "first-start"


def _handle_first_start():
    """Import GPG key on first start, then create a marker file."""
    if not _FIRST_START_FILE.exists():
        print("First start detected, importing GPG key…")
        # noinspection PyUnresolvedReferences
        KeyManager.import_key()
        _FIRST_START_FILE.touch()
    else:
        print("Not first start, skipping key import.")

def _ensure_filesystem():
    """Ensure that all necessary directories exist."""
    for path in [DATA_PATH, CONFIG_PATH, CACHE_PATH]:
        if not path.exists():
            print(f"Creating directory: {path}")
            path.mkdir(parents=True, exist_ok=True)


def main():
    _handle_first_start()
    _ensure_filesystem()

    app = QGuiApplication(sys.argv)
    app.setDesktopFileName("moe.nyarchlinux.nyarchupdaterqt")

    about_data = KAboutData(
        "nyarchupdaterqt",
        "Nyarch Updater",
        "0.1.0",
        "GUI App to update your Nyarch Linux system",
        KAboutLicense.GPL_V3,
        "(c) 2024 Nyarch Linux Team",
    )
    about_data.setHomepage("https://nyarchlinux.moe")
    about_data.setOrganizationDomain(b"nyarchlinux.moe")
    about_data.setDesktopFileName("moe.nyarchlinux.nyarchupdaterqt")
    about_data.setBugAddress(b"https://github.com/NyarchLinux/nyarchupdater-qt/issues")
    KAboutData.setApplicationData(about_data)

    app.setApplicationName("nyarchupdaterqt")
    app.setApplicationVersion("0.1.0")
    app.setApplicationDisplayName("Nyarch Updater")
    app.setOrganizationName("Nyarch Linux")
    app.setOrganizationDomain("nyarchlinux.moe")

    # Load the app icon from the SVG at the project root
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    app.setWindowIcon(QIcon(os.path.join(project_root, "moe.nyarchlinux.updaterqt.svg")))

    engine = QQmlApplicationEngine()

    signal.signal(signal.SIGINT, signal.SIG_DFL)

    if not os.environ.get("QT_QUICK_CONTROLS_STYLE"):
        os.environ["QT_QUICK_CONTROLS_STYLE"] = "org.kde.desktop"

    base_path = os.path.abspath(os.path.dirname(__file__))
    url = QUrl(f"file://{base_path}/qml/main.qml")
    engine.load(url)

    if len(engine.rootObjects()) == 0:
        quit()

    app.exec()

if __name__ == "__main__":
    main()
