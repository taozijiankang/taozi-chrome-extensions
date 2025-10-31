import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import dayjs from "dayjs";

process.env.TZ = "Asia/Shanghai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @typedef {Object} IterationVersionOptions
 * @property {string} [major] 主版本号
 * @property {string} [minor] 次版本号
 */

/**
 * 迭代版本号
 * 指定主版本号和次版本号，自动迭代修订版本号
 */

program
  .version("1.0.0")
  .description("迭代版本号")
  .option("-m, --major <major>", "主版本号")
  .option("-n, --minor <minor>", "次版本号")
  .action(() => {
    iterationVersion(program.opts());
  })
  .parse(process.argv);

/**
 * @param {IterationVersionOptions} options
 */
async function iterationVersion(options) {
  const { major = "1", minor = "0" } = options;

  const packageJsonPath = path.join(__dirname, "../package.json");

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

  const newVersion = `${major}.${minor}.${dayjs().format("YYYYMMDDHHmmss")}`;

  console.log(`${packageJson.name} 的版本号迭代为 ${newVersion}`);

  packageJson.version = newVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
}
