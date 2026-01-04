import { MessageAlertType } from "../../constant";
import { useLocalStorage } from "../useLocalStorage";

export interface MessageAlertItem {
  type: MessageAlertType;
  count: number;
}

export interface MessageAlertLocalStorage {
  /** 消息提醒 */
  messageAlerts?: MessageAlertItem[];
}

export const messageAlertLocalStorage = useLocalStorage<string, MessageAlertLocalStorage>("message-alert-local-storage", {
  messageAlerts: []
});
