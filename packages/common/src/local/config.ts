import { useLocalStorage } from "./useLocalStorage";

export interface ConfigLocalStorage {
  figmaApiKey?: string;
  baiduAppId?: string;
  baiduKey?: string;
  /** 当前激活的标签页 */
  popupActiveTab?: string;
  /** 主页当前激活的标签页 */
  homeActiveTab?: string;
  /** 代理服务地址 */
  proxyServiceUrl?: string;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  figmaApiKey: "",
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  proxyServiceUrl: ""
});
