import { Page, PageUrlMap } from "@taozi-chrome-extensions/common/src/constant/page";
import { figmaAssetsBackgroundForwardingMessage, figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message";
import { requestFigmaImages, requestFigmaNodeInfo } from "@taozi-chrome-extensions/common/src/api/modules/figma";
import type { Figma } from "@taozi-chrome-extensions/common/src/type/modules/figma";
import { requestUploadAsset } from "@taozi-chrome-extensions/common/src/api/modules/taozi";

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
          const imageNodes: {
            id: string;
            width: number;
            height: number;
          }[] = [];
          const f = (item: Figma.Api.NodeInfo) => {
            if (item.exportSettings?.some(item => item.format === "PNG") || item.fills.some(item => item.type === "IMAGE")) {
              imageNodes.push({
                id: item.id,
                width: item.absoluteRenderBounds.width,
                height: item.absoluteRenderBounds.height
              });
              return;
            }
            item.children?.forEach(child => {
              f(child);
            });
          };
          f(nodeInfo);
          const images: Figma.Api.Images[] = [];
          if (imageNodes.length > 0) {
            const imagesData = await requestFigmaImages({
              fileKey: req.fileKey,
              nodeIds: imageNodes.map(item => item.id),
              scale: 4,
              format: "png"
            });
            images.push(...imagesData);
          }
          const res = await figmaAssetsMessage.sendTabMessage(figmaControlTab.id, {
            ...req,
            nodeInfo,
            images: await Promise.all(
              images.map(async image => {
                const remoteUrl = await requestUploadAsset({
                  src: image.url,
                  isCompressed: false,
                  width: imageNodes.find(item => item.id === image.key.replace(":", "-"))?.width || 0,
                  height: imageNodes.find(item => item.id === image.key.replace(":", "-"))?.height || 0
                });
                return {
                  key: image.key,
                  url: remoteUrl
                } as Figma.Api.Images;
              })
            )
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
