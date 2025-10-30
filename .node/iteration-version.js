import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} IterationVersionOptions
 * @property {string} newVersion 新版本号
 */

program
  .version("1.0.0")
  .description("迭代版本号")
  .option("-n, --new-version <new-version>", "新版本号")
  .action(() => {
    iterationVersion(program.opts());
  })
  .parse(process.argv);

/**
 * @param {IterationVersionOptions} options
 */
async function iterationVersion(options) {
  /**
   * 去掉版本号前面的 v
   */
  options.newVersion = options.newVersion.replace(/^v/i, "");

  if (!/^(\d+)\.(\d+)\.(\d+)$/.test(options.newVersion)) {
    console.error("新版本号格式错误，格式为 x.x.x");
    return;
  }

  const { newVersion } = options;

  const packageJsonPath = path.join(__dirname, "../package.json");

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  const oldVersion = packageJson.version;

  packageJson.version = newVersion;

  console.log(`${packageJson.name} 的版本号从 ${oldVersion} 迭代为 ${newVersion}`);

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
}
