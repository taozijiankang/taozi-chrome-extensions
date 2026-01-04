import { setIcon } from "@/utils/setIcon";
import { MessageAlertType } from "@taozi-chrome-extensions/common/src/constant";
import { messageAlertLocalStorage, type MessageAlertItem, weixinLocalStorage } from "@taozi-chrome-extensions/common/src/local";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local";

export async function messageAlert() {
  const messageAlerts: MessageAlertItem[] = [];
  try {
    /**
     * 检测最新版本
     */
    const { hasNewVersion = false } = (await configLocalStorage.get()) || {};
    if (hasNewVersion) {
      messageAlerts.push({
        type: MessageAlertType.HasNewVersion,
        count: 1
      });
    }

    /**
     * 检测是否有小程序发版计划
     */
    const { mpReleasePlanList = [] } = (await weixinLocalStorage.get()) || {};
    if (mpReleasePlanList.length > 0) {
      messageAlerts.push({
        type: MessageAlertType.HasMpReleasePlan,
        count: mpReleasePlanList.length
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIcon(messageAlerts.length > 0);

    messageAlertLocalStorage.edit(async config => {
      config.messageAlerts = messageAlerts;
    });
  }
}
