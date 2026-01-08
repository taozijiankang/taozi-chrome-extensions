import { Page, PageUrlMap } from "@taozi-chrome-extensions/common/src/constant/page";
import { figmaAssetsBackgroundForwardingMessage, figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestFigmaImages, requestFigmaNodeInfo } from "../api";
import type { Figma } from "@taozi-chrome-extensions/common/src/type/modules/figma";

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
          const nodeInfo = await requestFigmaNodeInfo({ fileKey: req.fileKey, nodeId: req.nodeId });
          const imageIds: string[] = [];
          const f = (item: Figma.Api.NodeInfo) => {
            if (item.exportSettings?.some(item => item.format === "PNG") || item.fills.some(item => item.type === "IMAGE")) {
              imageIds.push(item.id);
              return;
            }
            item.children?.forEach(child => {
              f(child);
            });
          };
          f(nodeInfo);
          const images: Figma.Api.Images[] = [];
          if (imageIds.length > 0) {
            const imagesData = await requestFigmaImages({
              fileKey: req.fileKey,
              nodeIds: imageIds,
              scale: 4,
              format: "png"
            });
            images.push(...imagesData);
          }
          const res = await figmaAssetsMessage.sendTabMessage(figmaControlTab.id, {
            ...req,
            nodeInfo,
            images
          });
          return res;
        }
        return {
          succeed: false,
          msg: "请求参数为空"
        };
      }
    };
  });
}
