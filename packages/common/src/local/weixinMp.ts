import { useLocalStorage } from "./index";

export interface WeixinMpLocalStorage {
  searchInput?: string;
}

export const weixinMpLocalStorage = useLocalStorage<string, WeixinMpLocalStorage>("weixin-mp-local-storage", {
  searchInput: "",
});
