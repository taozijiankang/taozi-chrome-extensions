import { useLocalStorage } from "./useLocalStorage";

export interface WeixinLocalStorage {
  mpReleasePlanList?: {
    appId: string;
    name: string;
    headimg: string;
    username: string;
    email: string;
    type: string;
  }[];
  searchInput?: string;
}

export const weixinLocalStorage = useLocalStorage<string, WeixinLocalStorage>("weixin-local-storage", {
  searchInput: "",
  mpReleasePlanList: []
});
