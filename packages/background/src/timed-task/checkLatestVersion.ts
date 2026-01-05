import { requestLatestReleaseVersionList } from "@/api";
import semver from "semver";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local";

export async function checkLatestVersion() {
  const latestReleaseVersionList = await requestLatestReleaseVersionList();
  const onVersion = chrome.runtime.getManifest().version;

  const lastReleaseVersion = latestReleaseVersionList[0];

  if (lastReleaseVersion && semver.gt(lastReleaseVersion.tag_name, onVersion)) {
    configLocalStorage.edit(v => {
      v.hasNewVersion = true;
    });
  } else {
    configLocalStorage.edit(v => {
      v.hasNewVersion = false;
    });
  }
}
