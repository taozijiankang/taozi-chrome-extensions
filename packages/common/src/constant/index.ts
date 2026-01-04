import rootPackageJson from "../../../../package.json";

export * from "./page";
export * from "./enum";

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
