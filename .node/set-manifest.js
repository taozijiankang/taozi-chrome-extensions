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
 * @property {string} [pemContent] pem 内容
 */

program
  .version("1.0.0")
  .description("设置 manifest.json 中的 key 值")
  .option("-p, --pemContent <pemContent>", "pem 内容")
  .action(() => {
    setManifest(program.opts());
  })
  .parse(process.argv);

/**
 * @param {SetManifestOptions} options
 */
async function setManifest(options) {
  let { pemContent } = options;

  if (!pemContent) {
    throw new Error("pemContent 不能为空");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath).toString());

  manifest.key = getKey(pemContent);

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

/**
 * @param {string} pemContent
 */
function getKey(pemContent) {
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
