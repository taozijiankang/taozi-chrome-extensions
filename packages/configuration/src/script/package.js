import { getExtensionsDir } from "taozi-chrome-extensions/src/pathManage.js";
import { MANIFEST } from "../manifest.js";
import fs from "fs";
import path from "path";

fs.writeFileSync(path.join(getExtensionsDir(), "./manifest.json"), JSON.stringify(MANIFEST, undefined, 4));
