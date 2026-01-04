import { useLocalStorage } from "../useLocalStorage";

export interface GenVarNameLocalStorage {
  /** 生成变量名输入 */
  genVarNameInput?: string;
}

export const genVarNameLocalStorage = useLocalStorage<string, GenVarNameLocalStorage>("gen-var-name-local-storage", {
  genVarNameInput: ""
});
