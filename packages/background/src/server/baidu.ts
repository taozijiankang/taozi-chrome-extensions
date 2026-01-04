import { baiduTranslateMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestBaiduTranslate } from "../api";

export function startBaiduTranslateServer() {
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
}
