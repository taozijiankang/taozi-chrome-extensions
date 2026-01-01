import { useLocalStorage } from "./useLocalStorage";

export interface FigmaLocalStorage {}

export const figmaLocalStorage = useLocalStorage<string, FigmaLocalStorage>("figma-local-storage", {});
