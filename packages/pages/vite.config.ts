import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { dirname, resolve } from "node:path";
import { exec } from "node:child_process";

import rootPackageJson from "../../package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "/pages",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        popup: resolve(__dirname, "popup.html"),
        figma: resolve(__dirname, "figma.html")
      }
    }
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  define: {
    "process.env": {},
    __PACKAGE_JSON__: JSON.stringify(rootPackageJson),
    __COMMIT_INFO__: {
      hash: await getGitInfo("%h"),
      author: await getGitInfo("%an"),
      date: await getGitInfo("%cd"),
      title: await getGitInfo("%s"),
      message: await getGitInfo("%b"),
      messageFull: await getGitInfo("%B")
    }
  }
});

/**
 * 获取git信息
 */
function getGitInfo(format: string) {
  return new Promise<string>((resolve, reject) => {
    exec(
      `git log -1 HEAD --pretty=format:"${format}"`,
      {
        cwd: process.cwd()
      },
      (error, stdout) => {
        error ? reject(stdout) : resolve(stdout);
      }
    );
  }).catch(() => {
    return "";
  });
}
