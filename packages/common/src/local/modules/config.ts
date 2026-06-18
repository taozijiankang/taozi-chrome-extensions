import { useLocalStorage } from "../useLocalStorage";

/** 单份 Anthropic API 配置 */
export interface AnthropicConfigItem {
  /** 唯一 id */
  id: string;
  /** 配置名称（用户自定义，便于区分多份配置） */
  name: string;
  /** 鉴权方式（apiKey 与 authToken 二选一） */
  authType: "apiKey" | "authToken";
  /** API Key（走 x-api-key 头，官方鉴权方式） */
  apiKey: string;
  /** Auth Token（走 Authorization: Bearer 头，常用于代理/第三方兼容端点） */
  authToken: string;
  /** API Base URL（默认官方地址，可配置为代理或第三方兼容端点） */
  baseUrl: string;
  /** 默认模型 */
  model: string;
}

export interface ConfigLocalStorage {
  /** 百度翻译api id */
  baiduAppId?: string;
  /** 百度翻译api key */
  baiduKey?: string;

  /** Anthropic API 配置列表（支持多份，便于切换） */
  anthropicConfigs?: AnthropicConfigItem[];
  /** 当前激活的 Anthropic 配置 id */
  anthropicActiveConfigId?: string;

  /** 弹窗当前激活的标签页 */
  popupActiveTab?: string;
  /** 是否有新版本 */
  hasNewVersion?: boolean;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  anthropicConfigs: [],
  anthropicActiveConfigId: "",
  hasNewVersion: false
});
