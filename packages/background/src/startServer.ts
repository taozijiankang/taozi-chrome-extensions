import { addMessageServer, type MessageReq } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { requestBaiduTranslate } from "./api/baiduTranslate";
import { requestUploadAsset } from "./api/uploadAsset";

export function startServer() {
  addMessageServer(MessageType.BaiduTranslate, (req: MessageReq<string>, sender, sendResponse) => {
    sendResponse(requestBaiduTranslate(req.value || ""));
  });

  addMessageServer(
    MessageType.UploadAsset,
    (
      req: MessageReq<{
        src: string;
        isCompressed: boolean;
        width: number;
        height: number;
      }>,
      sender,
      sendResponse
    ) => {
      sendResponse(
        requestUploadAsset(
          req.value || {
            src: "",
            isCompressed: false,
            width: 0,
            height: 0,
          }
        )
      );
    }
  );
}
