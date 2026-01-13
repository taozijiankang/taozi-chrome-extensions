import { useLocalStorage } from "../useLocalStorage";

export interface FigmaLocalStorage {
  /** figma 应用页面当前激活的标签页 */
  activeTab?: string;
  /** figma api key */
  figmaApiKey?: string;
  /** figma 应用页面当前激活的节点树的con配置 */
  conConfigs?: any[];
  /** figma 应用页面当前激活的节点树的con代码类型 */
  codeEditorCodeType?: string;
  /** figma 应用页面当前激活的节点树的con id */
  activeNodeTreeConId?: string;
}

export const figmaLocalStorage = useLocalStorage<string, FigmaLocalStorage>("figma-local-storage", {
  activeTab: "",
  figmaApiKey: ""
});
