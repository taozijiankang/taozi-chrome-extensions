import { useLocalStorage } from "../useLocalStorage";
import { MessageAlertType } from "../../constant";

export interface ConfigLocalStorage {
  /** 百度翻译api id */
  baiduAppId?: string;
  /** 百度翻译api key */
  baiduKey?: string;
  /** 代理服务地址 */
  proxyServiceUrl?: string;
  /** 弹窗当前激活的标签页 */
  popupActiveTab?: string;
  /** 消息提醒 */
  messageAlerts?: MessageAlertType[];
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  proxyServiceUrl: "",
  messageAlerts: []
});
