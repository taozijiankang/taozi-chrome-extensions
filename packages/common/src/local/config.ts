import { useLocalStorage } from "./useLocalStorage";

export interface ConfigLocalStorage {
  baiduAppId?: string;
  baiduKey?: string;
  /** 弹窗当前激活的标签页 */
  popupActiveTab?: string;
  /** 代理服务地址 */
  proxyServiceUrl?: string;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  proxyServiceUrl: ""
});
