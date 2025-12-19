import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getProjectRootDir() {
  return path.join(__dirname, "../../../");
}

export function getExtensionsDir() {
  return path.join(getProjectRootDir(), "./extensions");
}
