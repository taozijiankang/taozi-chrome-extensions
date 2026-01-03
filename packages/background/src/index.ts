import { baiduTranslateMessage, uploadAssetToOssMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestBaiduTranslate } from "./api/baiduTranslate";
import { requestUploadAsset } from "./api/uploadAsset";

chrome.runtime.onInstalled.addListener(() => {
  console.log("安装扩展");
});

console.log("运行 background servers worker 脚本");

start();

function start() {
  baiduTranslateMessage.addListener(req => {
    return {
      result: true,
      getResponse: async () => {
        if (!req) {
          return {
            succeed: false,
            msg: "请求参数为空"
          };
        }
        const test = await requestBaiduTranslate(req);
        return {
          succeed: true,
          data: test
        };
      }
    };
  });

  uploadAssetToOssMessage.addListener(req => {
    return {
      result: true,
      getResponse: async () => {
        if (!req) {
          return {
            succeed: false,
            msg: "请求参数为空"
          };
        }
        const remoteUrl = await requestUploadAsset(req);
        return {
          succeed: true,
          data: remoteUrl
        };
      }
    };
  });
}
