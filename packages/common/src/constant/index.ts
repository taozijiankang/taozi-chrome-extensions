import rootPackageJson from "../../../../package.json";

export * from "./page";
export * from "./enum";

/**
 * 代理服务地址
 */
export const proxyServiceUrl = "https://taozi-chrome-extensions-proxy-function.zhansousou.com";

/**
 * 所有url匹配
 */
export const AllUrlsMatches = "<all_urls>";

/**
 * Github 仓库地址
 */
export const GithubRepo = {
  owner: rootPackageJson.repository.owner,
  repo: rootPackageJson.repository.repo
};
