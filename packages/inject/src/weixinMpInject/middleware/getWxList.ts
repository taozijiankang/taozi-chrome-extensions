import type { WXMPItem } from "../api/type";
import { requestWxaList } from "../api";
import { weixinLocalStorage } from "@taozi-chrome-extensions/common/src/local/weixin";

const wxaListCache: WXMPItem[] = [];

export const getWxList = async () => {
  if (wxaListCache.length === 0) {
    console.log("获取小程序列表");
    wxaListCache.push(...(await requestWxaList()));
    /**
     * 获取小程序列表
     * 并更新本地存储
     */
    weixinLocalStorage.edit(v => {
      v.mpReleasePlanList?.forEach(item => {
        const wxItem = wxaListCache.find(wxa => wxa.appid === (item.appId || ""));
        if (wxItem) {
          item.name = wxItem.app_name;
          item.headimg = wxItem.app_headimg;
          item.username = wxItem.username;
          item.email = wxItem.email;
          item.type = wxItem.type;
        }
      });
    });
  }
  return wxaListCache;
};
