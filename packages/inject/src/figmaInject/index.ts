import { getAssets, getBaseCodes } from "./elController";
import { figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message/content/FigmaMessage";

/**
 * figma 代码注入
 */
export function figmaInject() {
  figmaAssetsMessage.addListener(async () => {
    console.log("收到figma资产消息");
    const { codes, assets } = await getFigmaAssets();
    return {
      succeed: true,
      data: { codes, assets }
    };
  });
}

async function getFigmaAssets() {
  const codes = await getBaseCodes();
  const assets = await getAssets();

  return {
    codes,
    assets
  };
}
