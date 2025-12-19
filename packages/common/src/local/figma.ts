import { useLocalStorage } from "./useLocalStorage";

export interface FigmaLocalStorage {
  componentName?: string;
  assets?: {
    name: string;
    figmaDownloadUrl: string;
    ossUrl: string;
  }[];
}

export const figmaLocalStorage = useLocalStorage<string, FigmaLocalStorage>("figma-local-storage", {
  componentName: "",
  assets: []
});
