export interface BaseCode {
  title: string;
  lang: string;
  content: string;
}

export interface FigmaNodeInfo {
  id: string;
  children: FigmaNodeInfo[];
  name: string;
  type: "FRAME" | "TEXT" | "RECTANGLE";
  characters?: string;
  exportSettings?: {
    format: "PNG";
  }[];
  fills: {
    type: "IMAGE";
  }[];
  absoluteBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  absoluteRenderBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
