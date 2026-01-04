import { openPageMessage } from "@taozi-chrome-extensions/common/src/message";
import { openPage } from "@taozi-chrome-extensions/common/src/utils/openPage";

export function startPageServer() {
  openPageMessage.addListener(req => {
    if (req?.page) {
      openPage(req.page);
    }
    return {
      result: true
    };
  });
}
