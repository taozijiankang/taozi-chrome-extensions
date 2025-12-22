import { baiduTranslateMessage, uploadAssetToOssMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestBaiduTranslate } from "./api/baiduTranslate";
import { requestUploadAsset } from "./api/uploadAsset";

chrome.runtime.onInstalled.addListener(() => {
  console.log("安装扩展");
});

console.log("运行 background servers worker 脚本");

start();

function start() {
  baiduTranslateMessage.addListener(async req => {
    const res = await requestBaiduTranslate(req);
    return {
      succeed: true,
      data: res
    };
  });

  uploadAssetToOssMessage.addListener(async req => {
    const res = await requestUploadAsset(req);
    return {
      succeed: true,
      data: res
    };
  });
}
