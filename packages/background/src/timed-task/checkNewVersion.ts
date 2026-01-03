import { getGithubTags } from "@/api";

export async function checkNewVersion() {
  const tags = await getGithubTags();
  const currentVersion = chrome.runtime.getManifest().version;
  const latestVersion = tags[0].name;
  if (currentVersion !== latestVersion) {
    console.log(`当前版本 ${currentVersion} 不是最新版本 ${latestVersion}`);
  }
  console.log(`当前版本 ${currentVersion} 是最新版本 ${latestVersion}`);
}
