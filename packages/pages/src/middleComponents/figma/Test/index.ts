import type { TabItem } from "@/components/Tabs";

export enum TestTabType {
  CodeEditor = "CodeEditor",
  CodeTest = "CodeTest"
}

export const tabs: TabItem[] = [
  { label: "CodeEditor", value: TestTabType.CodeEditor },
  { label: "CodeTest", value: TestTabType.CodeTest }
];
