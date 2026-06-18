import { requestAnthropicChatMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestAnthropicChat } from "@taozi-chrome-extensions/common/src/api/modules/anthropic";

export function startAnthropicServer() {
  requestAnthropicChatMessage.addListener(req => {
    return {
      result: true,
      getResponse: async () => {
        if (!req) {
          return {
            succeed: false,
            msg: "请求参数为空"
          };
        }
        const response = await requestAnthropicChat(req);
        return {
          succeed: true,
          data: response
        };
      }
    };
  });
}
