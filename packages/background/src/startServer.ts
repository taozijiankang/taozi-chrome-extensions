import { addMessageServer, type MessageReq } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { requestBaiduTranslate } from "./api/baiduTranslate";

export function startServer() {
  addMessageServer(MessageType.BaiduTranslate, (req: MessageReq<string>, sender, sendResponse) => {
    sendResponse(requestBaiduTranslate(req.value || ""));
  });
}
