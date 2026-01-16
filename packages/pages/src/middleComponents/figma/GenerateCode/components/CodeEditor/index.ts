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

export enum AiCommand {
  OptimizeComponentName = "optimizeComponentName",
  OptimizeStyle = "optimizeStyle"
}

export const aiCommandOptions: { label: string; value: AiCommand }[] = [
  {
    label: "AI优化组件名",
    value: AiCommand.OptimizeComponentName
  },
  {
    label: "AI优化样式",
    value: AiCommand.OptimizeStyle
  }
];
