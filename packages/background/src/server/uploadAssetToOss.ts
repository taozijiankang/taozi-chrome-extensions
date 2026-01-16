import { uploadAssetToOssMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestUploadAsset } from "@taozi-chrome-extensions/common/src/api/modules/taozi";

export function startUploadAssetToOssServer() {
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
