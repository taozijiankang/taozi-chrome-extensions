import { Page, PageUrlMap } from "@taozi-chrome-extensions/common/src/constant/page";
import { figmaAssetsBackgroundForwardingMessage, figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message";

export function startFigmaServer() {
  figmaAssetsBackgroundForwardingMessage.addListener(req => {
    return {
      result: true,
      getResponse: async () => {
        if (req) {
          const figmaControlPageUrl = chrome.runtime.getURL(PageUrlMap[Page.Figma]);
          const tabs = await chrome.tabs.query({});
          const figmaControlTab = tabs.find(tab => tab.url === figmaControlPageUrl);
          if (!figmaControlTab) {
            return {
              succeed: false,
              msg: "figma控制页面未打开"
            };
          }
          if (!figmaControlTab.id) {
            return {
              succeed: false,
              msg: "figma控制页面tabId为空"
            };
          }
          await figmaAssetsMessage.sendTabMessage(figmaControlTab.id, req);
          return {
            succeed: true,
            data: undefined
          };
        }
        return {
          succeed: false,
          msg: "请求参数为空"
        };
      }
    };
  });
}
