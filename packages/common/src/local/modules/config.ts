import { useLocalStorage } from "../useLocalStorage";

export interface ConfigLocalStorage {
  /** 百度翻译api id */
  baiduAppId?: string;
  /** 百度翻译api key */
  baiduKey?: string;

  /** 弹窗当前激活的标签页 */
  popupActiveTab?: string;
  /** 是否有新版本 */
  hasNewVersion?: boolean;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  hasNewVersion: false
});
