import { startServer } from "./startServer";

chrome.runtime.onInstalled.addListener(() => {
  console.log("安装扩展");

  registerContentScripts();
});

console.log("运行 background servers worker 脚本");

start();

function start() {
  startServer();
}

function registerContentScripts() {
  chrome.scripting.registerContentScripts([
    {
      id: "default",
      matches: ["*://codesign.qq.com/*", "*://app.apifox.com/*", "*://www.tapd.cn/*"],
      js: ["inject/index.iife.js"],
      css: ["inject/index.css"],
      runAt: "document_idle"
    }
  ]);
}
