import { useMessage } from "../useMessage";
import type { Figma } from "../../type/modules/figma";

export interface FigmaAssetsReq {
  fileKey: string;
  nodeId: string;
  codes: Figma.BaseCode[];
}

export interface FigmaAssetsExtendReq extends FigmaAssetsReq {
  nodeInfo: Figma.Api.NodeInfo;
  images: Figma.Api.Images[];
}

// background 转发到 figma 控制页面
export const figmaAssetsBackgroundForwardingMessage = useMessage<FigmaAssetsReq, void>(
  "figma-assets-background-forwarding-message"
);
// 发送figma资产任务消息
export const figmaAssetsMessage = useMessage<FigmaAssetsExtendReq, void>("figma-assets-message");
