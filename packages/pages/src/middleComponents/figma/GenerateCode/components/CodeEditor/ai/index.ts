import type { OpenAi } from "@taozi-chrome-extensions/common/src/type";
import type { BaseCon } from "../controller";
import { JSON_OUTPUT_SYSTEM_PROMPT } from "@taozi-chrome-extensions/common/src/constant/prompt";
import { requestOpenAIChatCompletionMessage } from "@taozi-chrome-extensions/common/src/message";

export interface OptimizeConComponentNameResult {
  key: string;
  name: string;
}

export async function optimizeConComponentName(con: BaseCon): Promise<OptimizeConComponentNameResult[]> {
  const prompt = con.getPrompt();
  if (!prompt) {
    throw new Error("获取节点提示词失败");
  }

  const JSONSystemMessage: OpenAi.Api.OpenAIMessage = {
    role: "system",
    content: JSON_OUTPUT_SYSTEM_PROMPT
  };

  const response = await requestOpenAIChatCompletionMessage.sendMessage({
    messages: [
      JSONSystemMessage,
      {
        role: "user",
        content: `
              修改如下代码的类名，使其更加合理和人性化。
              你会结合元素的alt提示，和子元素信息来命名，使名字在整个代码中具有唯一性和可读性。
              你命名要尽可能简短

              \`\`\`html
              ${prompt}
              \`\`\`

              返回结果格式为 {key: string, name: string}[]，其中的key必须是节点在html中的data-key属性值，name为修改后的类名
              示例：
              \`\`\`json
              [
                {
                    "key": "123",
                    "name": "test"
                  }
                ]
              \`\`\`

              注意：
              1. 避免出现重复的类名
              2. 禁止出现空字符串
            `
      }
    ],
    model: "gpt-3.5-turbo",
    temperature: 1
  });

  return JSON.parse(response.data?.choices[0]?.message?.content || "[]") as OptimizeConComponentNameResult[];
}
