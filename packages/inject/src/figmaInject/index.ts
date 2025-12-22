import { getBaseCodes } from "./elController";
import { figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message/content/FigmaMessage";

/**
 * figma 代码注入
 */
export function figmaInject() {
  figmaAssetsMessage.addListener(async () => {
    console.log("收到获取figma资产任务消息");
    const url = new URL(window.location.href);
    const nodeId = url.searchParams.get("node-id");
    const fileKey = url.href.match(/www\.figma\.com\/design\/(.*?)\//)?.[1] || "";

    if (!nodeId || !fileKey) {
      return {
        succeed: false,
        msg: "获取figma资产任务消息失败，nodeId或fileKey为空"
      };
    }

    const { codes } = await getFigmaAssets();
    return {
      succeed: true,
      data: { fileKey, nodeId, codes }
    };
  });
}

async function getFigmaAssets() {
  const codes = await getBaseCodes();

  return {
    codes
  };
}
