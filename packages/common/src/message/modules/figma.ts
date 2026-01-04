import { useMessage } from "../useMessage";

export interface FigmaAssetsReq {
  fileKey: string;
  nodeId: string;
  codes: {
    title: string;
    lang: string;
    content: string;
  }[];
}

// 发送figma资产任务消息
export const figmaAssetsMessage = useMessage<FigmaAssetsReq, void>("figma-assets-message");
// background 转发到 figma 控制页面
export const figmaAssetsBackgroundForwardingMessage = useMessage<FigmaAssetsReq, void>(
  "figma-assets-background-forwarding-message"
);
