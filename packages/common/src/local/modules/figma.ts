import { useLocalStorage } from "../useLocalStorage";

export interface FigmaLocalStorage {
  /** figma 应用页面当前激活的标签页 */
  activeTab?: string;
  /** figma api key */
  figmaApiKey?: string;
}

export const figmaLocalStorage = useLocalStorage<string, FigmaLocalStorage>("figma-local-storage", {
  activeTab: "",
  figmaApiKey: ""
});
