from pathlib import Path
from platformdirs import PlatformDirs

# Bundled assets (shipped with the source code)
ASSETS_PATH = Path(__file__).parent / "assets"

# User directories
PATHS = PlatformDirs("Nyarch Updater", "Nyarch Linux", ensure_exists=True)
CACHE_PATH = PATHS.user_cache_path
CONFIG_PATH = PATHS.user_config_path
DATA_PATH = PATHS.user_data_path
LOG_PATH = PATHS.user_log_path

CACHE_DIR = PATHS.user_cache_dir
CONFIG_DIR = PATHS.user_config_dir
DATA_DIR = PATHS.user_data_dir
LOG_DIR = PATHS.user_log_dir