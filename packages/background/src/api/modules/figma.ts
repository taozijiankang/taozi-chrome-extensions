import type { Figma } from "@taozi-chrome-extensions/common/src/type/modules/figma";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local";

export async function requestFigmaNodeInfo(fileKey: string, nodeId: string): Promise<Figma.FigmaNodeInfo> {
  const { figmaApiKey = "" } = (await figmaLocalStorage.get()) || {};
  if (!figmaApiKey) {
    throw new Error("请配置figma api key");
  }
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`, {
    headers: {
      "X-Figma-Token": figmaApiKey
    }
  });
  const data = await response.json();
  return data.nodes?.[nodeId.replace("-", ":")]?.document;
}
