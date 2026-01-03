import { useMessage } from "../useMessage";

export interface FigmaAssetsReq {
  fileKey: string;
  nodeId: string;
  codes: string[];
}

export interface FigmaAssetsRes {}

export const figmaAssetsMessage = useMessage<FigmaAssetsReq, FigmaAssetsRes>("figma-assets");
