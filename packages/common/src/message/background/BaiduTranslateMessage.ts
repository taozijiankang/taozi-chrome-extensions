import { BaseMessage } from "../BaseMessage";

class BaiduTranslateMessage extends BaseMessage<string, string> {}

export const baiduTranslateMessage = new BaiduTranslateMessage("baidu-translate");
