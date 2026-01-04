import { useLocalStorage } from "../useLocalStorage";

export interface CodesignLocalStorage {
  /** 项目类型 */
  objectType?: string;
  /** 框架类型 */
  frameType?: string;
  /** 注释 */
  annotations?: Record<string, string>;
  /** 名称翻译 */
  nameTranslates?: Record<string, string>;
  /** 名称 */
  names?: Record<string, string>;
  /** 图标url */
  iconUrls?: Record<string, string>;
  /** 配置 */
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
