import { requestOpenAIChatCompletionMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestOpenAIChatCompletion } from "@taozi-chrome-extensions/common/src/api/modules/openAi";

export function startOpenAiServer() {
  requestOpenAIChatCompletionMessage.addListener(req => {
    return {
      result: true,
      getResponse: async () => {
        if (!req) {
          return {
            succeed: false,
            msg: "请求参数为空"
          };
        }
        const response = await requestOpenAIChatCompletion(req);
        return {
          succeed: true,
          data: response
        };
      }
    };
  });
}
