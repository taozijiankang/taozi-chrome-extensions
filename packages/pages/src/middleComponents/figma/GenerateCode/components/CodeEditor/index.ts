import type { TabItem } from "@/components/Tabs";

export enum EditorTabType {
  Props = "props",
  Code = "code"
}

export const editorTabs: TabItem[] = [
  {
    label: "属性",
    value: EditorTabType.Props
  },
  {
    label: "代码",
    value: EditorTabType.Code
  }
];
