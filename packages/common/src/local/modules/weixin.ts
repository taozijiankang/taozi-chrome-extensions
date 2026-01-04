import { useLocalStorage } from "../useLocalStorage";

export interface WeixinLocalStorage {
  /** 小程序发版计划列表 */
  mpReleasePlanList?: {
    appId: string;
    name: string;
    headimg: string;
    username: string;
    email: string;
    type: string;
  }[];
  /** 搜索输入 */
  searchInput?: string;
}

export const weixinLocalStorage = useLocalStorage<string, WeixinLocalStorage>("weixin-local-storage", {
  searchInput: "",
  mpReleasePlanList: []
});
