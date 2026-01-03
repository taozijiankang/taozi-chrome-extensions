import { useLocalStorage } from "../useLocalStorage";

export interface ConfigLocalStorage {
  /** 百度翻译api id */
  baiduAppId?: string;
  /** 百度翻译api key */
  baiduKey?: string;
  /** 代理服务地址 */
  proxyServiceUrl?: string;
  /** 弹窗当前激活的标签页 */
  popupActiveTab?: string;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  proxyServiceUrl: ""
});
