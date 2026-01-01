import type { WXMPItem } from "./type";

export function requestWxaList(): Promise<WXMPItem[]> {
  const token = location.search.split("token=")[1];
  return fetch(`https://mp.weixin.qq.com/wxamp/cgi/getWxaList?token=${token}&lang=zh_CN`)
    .then((res) => res.json())
    .then((res) => res.wax_list || []);
}
