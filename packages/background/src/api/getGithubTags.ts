import { proxyRequest } from "./proxyRequest";

export async function getGithubTags() {
  return proxyRequest("https://api.github.com/repos/taozijiankang/taozi-chrome-extensions/tags").then(res => res.json());
}
