import { copyDirectorySync } from "../copyDirectorySync.js";
import { getExtensionsDir } from "../pathManage.js";
import path from "path";
import fs from "fs";

/**
 * @param {string} distDir
 * @param {string} target
 */
export function packageF(distDir, target) {
  const targetDir = path.resolve(getExtensionsDir(), target);

  fs.readdirSync(targetDir).forEach((item) => {
    if (!/^readme\.md$/i.test(item)) {
      fs.rmSync(path.resolve(targetDir, item), {
        recursive: true,
      });
    }
  });

  copyDirectorySync(distDir, targetDir);
}

const param = process.argv.slice(2);
if (param.length === 2) {
  packageF(param[0], param[1]);
}
