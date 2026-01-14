import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local";
import type { OpenAi } from "@taozi-chrome-extensions/common/src/type/modules/openAi";

/**
 * 调用 OpenAI Chat Completion API
 * @param request 请求参数
 * @returns 聊天完成响应
 */
export async function requestOpenAIChatCompletion(
  request: OpenAi.Api.OpenAIChatCompletionRequest
): Promise<OpenAi.Api.OpenAIChatCompletionResponse> {
  const config = await configLocalStorage.get();
  let { openaiApiKey = "", openaiBaseUrl = "https://api.openai.com/v1", openaiApiVersion = "v1" } = config || {};

  openaiApiKey = openaiApiKey.trim();
  openaiBaseUrl = openaiBaseUrl.trim() || "https://api.openai.com/v1";

  if (!openaiApiKey) {
    throw new Error("请配置 OpenAI API Key");
  }

  if (!request.messages || request.messages.length === 0) {
    throw new Error("消息列表不能为空");
  }

  // 确保 baseUrl 不以 / 结尾
  const baseUrl = openaiBaseUrl.replace(/\/$/, "");
  const url = `${baseUrl}/chat/completions?api-version=${openaiApiVersion}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": openaiApiKey
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature ?? 1,
      max_tokens: request.max_tokens,
      top_p: request.top_p ?? 1,
      frequency_penalty: request.frequency_penalty ?? 0,
      presence_penalty: request.presence_penalty ?? 0,
      stop: request.stop,
      stream: request.stream ?? false
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as OpenAi.Api.OpenAIErrorResponse;
    throw new Error(error?.error?.message || `OpenAI API 请求失败: ${response.status} ${response.statusText}`);
  }

  return data as OpenAi.Api.OpenAIChatCompletionResponse;
}

/**
 * 简化的聊天接口，直接发送消息并获取回复
 * @param messages 消息列表
 * @param options 可选配置
 * @returns 助手回复的消息内容
 */
export async function requestOpenAIChat(
  messages: OpenAi.Api.OpenAIMessage[],
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  const response = await requestOpenAIChatCompletion({
    messages,
    ...options
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error("OpenAI API 返回空响应");
  }

  return response.choices[0].message.content;
}
