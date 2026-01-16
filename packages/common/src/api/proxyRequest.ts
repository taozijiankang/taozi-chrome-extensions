import { proxyServiceUrl } from "../constant";

export async function proxyRequest(url: string, init: RequestInit = {}) {
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
