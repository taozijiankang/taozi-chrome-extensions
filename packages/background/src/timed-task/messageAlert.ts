import { requestLatestReleaseVersionList } from "@/api";
import semver from "semver";
import { setIcon } from "@/utils/setIcon";
import { MessageAlertType } from "@taozi-chrome-extensions/common/src/constant";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local";

export async function messageAlert() {
  const messageAlerts: MessageAlertType[] = [];
  try {
    /**
     * 检测最新版本
     */
    const latestReleaseVersionList = await requestLatestReleaseVersionList();
    const onVersion = chrome.runtime.getManifest().version;

    const lastReleaseVersion = latestReleaseVersionList[0];

    if (lastReleaseVersion && semver.gt(lastReleaseVersion.tag_name, onVersion)) {
      messageAlerts.push(MessageAlertType.HasNewVersion);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIcon(messageAlerts.length > 0);
    configLocalStorage.edit(async config => {
      config.messageAlerts = messageAlerts;
    });
  }
}
