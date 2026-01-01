import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifestPath = path.join(__dirname, "../extensions/manifest.json");

/**
 * @typedef {Object} SetManifestOptions
 * @property {string} [pemPath] pem 文件路径
 */

program
  .version("1.0.0")
  .description("设置 manifest.json 中的 key 值")
  .option("-p, --pemPath <pemPath>", "pem 文件路径")
  .action(() => {
    setManifest(program.opts());
  })
  .parse(process.argv);

/**
 * @param {SetManifestOptions} options
 */
async function setManifest(options) {
  let { pemPath } = options;

  if (!pemPath) {
    throw new Error("pemPath 不能为空");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

  manifest.key = getKey(pemPath);

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

/**
 * @param {string} pemPath
 */
function getKey(pemPath) {
  const pemContent = fs.readFileSync(pemPath).toString();

  // 2. 从私钥中提取公钥
  const publicKey = crypto.createPublicKey({
    key: pemContent,
    format: "pem"
  });

  // 3. 导出为 Chrome 要求的 DER 格式并转为 Base64
  const keyBuffer = publicKey.export({
    type: "spki",
    format: "der"
  });

  const manifestKey = keyBuffer.toString("base64");

  return manifestKey;
}
