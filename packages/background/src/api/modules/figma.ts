import type { Figma } from "@taozi-chrome-extensions/common/src/type/modules/figma";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local";

/**
 * 获取figma节点信息
 * 文档：https://developers.figma.com/docs/rest-api/file-endpoints/#get-file-nodes-endpoint
 * @param fileKey
 * @param nodeId
 * @returns
 */
export async function requestFigmaNodeInfo(params: Figma.Api.GetFileNode.Req): Promise<Figma.Api.NodeInfo> {
  const { figmaApiKey = "" } = (await figmaLocalStorage.get()) || {};
  if (!figmaApiKey) {
    throw new Error("请配置figma api key");
  }
  const { fileKey, nodeId } = params;
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`, {
    headers: {
      "X-Figma-Token": figmaApiKey
    }
  });
  const data: Figma.Api.GetFileNode.Res = await response.json();
  if (data.err) {
    throw new Error(data.err);
  }
  return data.nodes?.[nodeId.replace("-", ":")]?.document;
}

/**
 * 获取figma图片
 * 文档：https://developers.figma.com/docs/rest-api/file-endpoints/#get-images-endpoint
 * @param fileKey figma file key
 * @param params
 * @returns figma images
 */
export async function requestFigmaImages(params: Figma.Api.GetImages.Req): Promise<Figma.Api.Images[]> {
  const { figmaApiKey = "" } = (await figmaLocalStorage.get()) || {};
  if (!figmaApiKey) {
    throw new Error("请配置figma api key");
  }
  const { fileKey, nodeIds, scale, format } = params;
  const paramsString = `ids=${nodeIds.join(",")}&scale=${scale}&format=${format}`;
  const response = await fetch(`https://api.figma.com/v1/images/${fileKey}?${paramsString}`, {
    headers: {
      "X-Figma-Token": figmaApiKey
    }
  });
  const data: Figma.Api.GetImages.Res = await response.json();
  if (data.err) {
    throw new Error(data.err);
  }
  return Object.entries(data.images).map(([key, value]) => {
    return {
      key,
      url: value
    } as Figma.Api.Images;
  });
}
