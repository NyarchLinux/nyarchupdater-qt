import { paths } from "./paths";
import { join } from "node:path";

export const FIRST_RUN_PATH = join(paths.data, "first-run");
export const ASSETS_PATH = join(__dirname, "assets");
