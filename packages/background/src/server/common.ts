import { requestReleaseVersionListMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestLatestReleaseVersionList } from "@taozi-chrome-extensions/common/src/api/modules/github";

export function startCommonServer() {
  requestReleaseVersionListMessage.addListener(() => {
    return {
      result: true,
      getResponse: async () => {
        const latestReleaseVersionList = await requestLatestReleaseVersionList();
        return {
          succeed: true,
          data: latestReleaseVersionList || []
        };
      }
    };
  });
}
