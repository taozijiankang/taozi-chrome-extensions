import type { TabItem } from "@/components/Tabs";

export enum EditorTabType {
  Props = "props",
  Code = "Code",
  Assets = "assets"
}

export const editorTabs: TabItem[] = [
  {
    label: "属性",
    value: EditorTabType.Props
  },
  {
    label: "代码",
    value: EditorTabType.Code
  },
  {
    label: "资源",
    value: EditorTabType.Assets
  }
];
