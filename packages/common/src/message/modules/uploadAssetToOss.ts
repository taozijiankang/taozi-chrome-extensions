import { useMessage } from "../useMessage";

export interface UploadAssetToOssReq {
  src: string;
  isCompressed: boolean;
  width: number;
  height: number;
}

export const uploadAssetToOssMessage = useMessage<UploadAssetToOssReq, string>("upload-asset-to-oss");
