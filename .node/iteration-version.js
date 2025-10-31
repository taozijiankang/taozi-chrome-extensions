import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import https from "https";
import semver from "semver";

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

  const maxSatisfyingVersion = await getMaxSatisfyingVersion(major, minor);

  const newVersion = semver.inc(maxSatisfyingVersion, "patch");

  console.log(`版本号迭代为 ${newVersion}`);

  packageJson.version = newVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
}

/**
 * @param {string} major
 * @param {string} minor
 */
async function getMaxSatisfyingVersion(major, minor) {
  /** @type {{name: string}[]} */
  const tagList = await new Promise((resolve, reject) => {
    https.get(
      "https://api.github.com/repos/taozijiankang/taozi-chrome-extensions/tags",
      {
        headers: {
          "User-Agent": "nodejs",
        },
      },
      (res) => {
        /** @type {Buffer[]} */
        let data = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          resolve(JSON.parse(Buffer.concat(data).toString()));
        });
        res.on("error", (err) => {
          reject(err);
        });
      }
    );
  });

  const targetMaxVersion = `${major}.${minor}.0`;

  return (
    semver.maxSatisfying(
      [...tagList.map((tag) => tag.name).filter((v) => /^v/i.test(v)), targetMaxVersion].filter((v) => !!semver.valid(v)),
      `${major}.${minor}.*`
    ) || targetMaxVersion
  );
}
