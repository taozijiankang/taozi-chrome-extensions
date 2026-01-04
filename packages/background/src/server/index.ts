import { startBaiduTranslateServer } from "./baidu";
import { startFigmaServer } from "./figma";
import { startPageServer } from "./page";
import { startUploadAssetToOssServer } from "./uploadAssetToOss";
import { startCommonServer } from "./common";

export function startServer() {
  startPageServer();
  startBaiduTranslateServer();
  startUploadAssetToOssServer();
  startFigmaServer();
  startCommonServer();
}
