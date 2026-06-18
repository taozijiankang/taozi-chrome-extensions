import Anthropic from "@anthropic-ai/sdk";
import { configLocalStorage } from "../../../local";
import type { AnthropicChat } from "../../../type";

/** 默认最大生成 token 数 */
const DEFAULT_MAX_TOKENS = 4096;
/** 默认模型（配置缺失时兜底） */
const DEFAULT_MODEL = "claude-sonnet-4-6";
/** 单次请求超时时间（毫秒）。SDK 默认 10 分钟过长，交互场景收紧到 2 分钟 */
const REQUEST_TIMEOUT = 120_000;
/** 请求重试次数。SDK 默认 2 次（含超时重试），收紧到 1 次避免失败时等待过久 */
const MAX_RETRIES = 1;

/**
 * 创建 Anthropic 客户端（读取用户在 configLocalStorage 中的配置）
 */
async function createAnthropicClient(): Promise<{ client: Anthropic; model: string }> {
  const config = await configLocalStorage.get();
  const list = config?.anthropicConfigs ?? [];
  const active = list.find(item => item.id === config?.anthropicActiveConfigId) ?? list[0];

  if (!active) {
    throw new Error("请先添加并选择一个 Anthropic 配置");
  }

  const baseUrl = (active.baseUrl || "").trim() || "https://api.anthropic.com";
  const model = (active.model || "").trim() || DEFAULT_MODEL;

  // 仅使用该配置选中的鉴权方式，另一种即使有值也忽略（apiKey 走 x-api-key，authToken 走 Authorization: Bearer）
  const useApiKey = active.authType !== "authToken";
  const apiKey = useApiKey ? (active.apiKey || "").trim() : "";
  const authToken = useApiKey ? "" : (active.authToken || "").trim();

  if (!apiKey && !authToken) {
    throw new Error(useApiKey ? "请配置 Anthropic API Key" : "请配置 Anthropic Auth Token");
  }

  const client = new Anthropic({
    apiKey: apiKey || null,
    authToken: authToken || null,
    baseURL: baseUrl,
    timeout: REQUEST_TIMEOUT,
    maxRetries: MAX_RETRIES,
    // 扩展的 background service worker 属于浏览器环境，SDK 默认禁止直连，需显式放开
    dangerouslyAllowBrowser: true
  });

  return { client, model };
}

/**
 * 调用 Anthropic Messages API
 * @param request 请求参数（model 缺省时使用配置中的默认模型，max_tokens 缺省时使用默认值）
 * @returns 响应（仅保留通用字段）
 */
export async function requestAnthropicChat(request: AnthropicChat.Req): Promise<AnthropicChat.Res> {
  if (!request.messages || request.messages.length === 0) {
    throw new Error("消息列表不能为空");
  }

  const { client, model } = await createAnthropicClient();

  return client.messages.create({
    model: request.model || model,
    max_tokens: request.max_tokens || DEFAULT_MAX_TOKENS,
    system: request.system,
    messages: request.messages,
    temperature: request.temperature
  });
}
