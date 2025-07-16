import { getExtensionsDir } from "taozi-chrome-extensions/src/pathManage.js";
import { MANIFEST } from "../manifest";
import fs from "fs";
import path from "path";

const extensionsDir = getExtensionsDir();

fs.writeFileSync(path.join(extensionsDir, "manifest.json"), JSON.stringify(MANIFEST, undefined, 4));
