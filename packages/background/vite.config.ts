import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const srcDir = path.resolve(__dirname, "src");

export default defineConfig({
  build: {
    lib: {
      name: "background",
      entry: path.resolve(srcDir, "index.ts"),
      formats: ["iife"],
      fileName: "index"
    }
  },
  define: {
    "process.env": {}
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
