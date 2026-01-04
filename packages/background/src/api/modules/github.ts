import { proxyRequest } from "../proxyRequest";
import { GithubRepo } from "@taozi-chrome-extensions/common/src/constant";
import type { Github } from "@taozi-chrome-extensions/common/src/type";

/**
 * 获取最近 10 个发布版本
 * @returns 最近 10 个发布版本
 */
export async function requestLatestReleaseVersionList(): Promise<Github.ReleaseVersion[]> {
  const url = `https://api.github.com/repos/${GithubRepo.owner}/${GithubRepo.repo}/releases?per_page=10`;
  return (
    proxyRequest(url)
      .then(res => res.json())
      .then(json => json as Github.ReleaseVersion[])
      // 只保留需要的字段
      .then(list => {
        return list.map(item => {
          return {
            url: item.url,
            html_url: item.html_url,
            name: item.name,
            tag_name: item.tag_name,
            body: item.body,
            created_at: item.created_at,
            published_at: item.published_at,
            assets: item.assets
          } as Github.ReleaseVersion;
        });
      })
  );
}
