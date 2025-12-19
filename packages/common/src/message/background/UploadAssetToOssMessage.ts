import { BaseMessage } from "../BaseMessage";

export interface UploadAssetToOssReq {
  src: string;
  isCompressed: boolean;
  width: number;
  height: number;
}

class UploadAssetToOssMessage extends BaseMessage<UploadAssetToOssReq, string> {
  constructor() {
    super("upload-asset-to-oss");
  }
}

export const uploadAssetToOssMessage = new UploadAssetToOssMessage();
