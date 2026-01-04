import { requestReleaseVersionListMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestLatestReleaseVersionList } from "@/api";

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
