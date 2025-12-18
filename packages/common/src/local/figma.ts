import { useLocalStorage } from "./index";

export interface FigmaLocalStorage {
  componentName?: string;
}

export const figmaLocalStorage = useLocalStorage<string, FigmaLocalStorage>("figma-local-storage", {
  componentName: "",
});
