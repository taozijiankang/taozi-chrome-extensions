import { useLocalStorage } from "../useLocalStorage";

export interface ConfigLocalStorage {
  /** 百度翻译api id */
  baiduAppId?: string;
  /** 百度翻译api key */
  baiduKey?: string;

  /** OpenAI API Key */
  openaiApiKey?: string;
  /** OpenAI API Base URL (可选，默认为官方地址，可配置为 Azure OpenAI 等自定义端点) */
  openaiBaseUrl?: string;
  /** OpenAI API Version */
  openaiApiVersion?: string;

  /** 弹窗当前激活的标签页 */
  popupActiveTab?: string;
  /** 是否有新版本 */
  hasNewVersion?: boolean;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  openaiApiKey: "",
  openaiBaseUrl: "https://api.openai.com/v1",
  openaiApiVersion: "v1",
  hasNewVersion: false
});
