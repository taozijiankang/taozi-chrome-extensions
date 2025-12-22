import { useLocalStorage } from "./useLocalStorage";

export interface FigmaLocalStorage {
  activeTab?: string;
  /** 节点自定义数据列表 */
  nodeCuDataList?: {
    fileKey: string;
    nodeId: string;
    name: string;
    ossUrl?: string;
  }[];
}

export const figmaLocalStorage = useLocalStorage<string, FigmaLocalStorage>("figma-local-storage", {
  activeTab: "",
  nodeCuDataList: []
});
