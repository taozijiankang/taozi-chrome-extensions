import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local";

export async function proxyRequest(url: string, init: RequestInit = {}) {
  const { proxyServiceUrl = "" } = (await configLocalStorage.get()) || {};
  if (!proxyServiceUrl) {
    throw new Error("请配置代理服务地址");
  }
  const originUrl = new URL(url);
  const targetUrl = new URL(`${originUrl.pathname}${originUrl.search}`, proxyServiceUrl);
  return fetch(targetUrl.toString(), {
    ...init,
    headers: {
      ...init.headers,
      "x-target": originUrl.toString(),
      "x-cookie": (init.headers as Record<string, string>)?.["cookie"] || ""
    }
  });
}
