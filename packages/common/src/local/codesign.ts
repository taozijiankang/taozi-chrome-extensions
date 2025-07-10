import { useLocalStorage } from "./index";

export interface CodesignLocalStorage {
  objectType?: string;
  frameType?: string;
  annotations?: Record<string, string>;
  nameTranslates?: Record<string, string>;
  names?: Record<string, string>;
  iconUrls?: Record<string, string>;
  config?: {
    /** 是否忽略css的字体 */
    ignoreCssFontFamily?: boolean;
    /** 在有padding属性时是否加入box-sizing: border-box */
    boxSizing?: boolean;
    /** react css模块名称 */
    reactCssModuleName?: string;
  };
}

export const codesignLocalStorage = useLocalStorage<string, CodesignLocalStorage>("codesign-local-storage", {
  objectType: "",
  frameType: "",
  annotations: {},
  nameTranslates: {},
  names: {},
  iconUrls: {},
  config: {}
});
