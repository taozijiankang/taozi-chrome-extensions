import { startBaiduTranslateServer, startPageServer } from "./server";
import { startUploadAssetToOssServer } from "./server";
import { startFigmaServer } from "./server";

chrome.runtime.onInstalled.addListener(() => {
  console.log("安装扩展");
});

console.log("运行 background servers worker 脚本");

start();

function start() {
  startPageServer();
  startBaiduTranslateServer();
  startUploadAssetToOssServer();
  startFigmaServer();
}
