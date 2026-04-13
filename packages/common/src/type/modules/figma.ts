export namespace Figma {
  export interface BaseCode {
    title: string;
    lang: "html" | "css";
    content: string;
  }

  export namespace Api {
    export interface NodeInfo {
      id: string;
      children?: NodeInfo[];
      name: string;
      type: "FRAME" | "TEXT" | "RECTANGLE";
      characters?: string;
      exportSettings?: {
        format: "PNG";
      }[];
      fills?: {
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

    export interface Images {
      key: string;
      url: string;
    }

    /**
     * 获取get-file-nodes
     * 文档：https://developers.figma.com/docs/rest-api/file-endpoints/#get-file-nodes-endpoint
     */
    export namespace GetFileNode {
      export interface Req {
        fileKey: string;
        nodeId: string;
      }
      export interface Res {
        name: string;
        err?: string;
        nodes: {
          [key: string]: {
            document: NodeInfo;
          };
        };
      }
    }

    /**
     * 获取get-images
     * 文档：https://developers.figma.com/docs/rest-api/file-endpoints/#get-images-endpoint
     */
    export namespace GetImages {
      export interface Req {
        fileKey: string;
        nodeIds: string[];
        /** A number between 0.01 and 4, the image scaling factor */
        scale: number;
        format: "png" | "jpg" | "svg" | "pdf";
      }
      export interface Res {
        err?: string;
        images: {
          [key: string]: string;
        };
      }
    }
  }
}
