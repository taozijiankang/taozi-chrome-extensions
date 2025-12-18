import { addMessageServer, type MessageReq } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { getAssets, getBaseCodes } from "./elController";

/**
 * figma 代码注入
 */
export function figmaInject() {
  addMessageServer(MessageType.GetFigmaAssets, (req: MessageReq<void>, sender, sendResponse) => {
    sendResponse(getFigmaAssets());
  });
}

async function getFigmaAssets() {
  const codes = await getBaseCodes();
  const assets = await getAssets();

  return {
    codes,
    assets
  };
}
