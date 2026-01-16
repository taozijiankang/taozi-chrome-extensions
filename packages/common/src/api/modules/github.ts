import { proxyRequest } from "../proxyRequest";
import { GithubRepo } from "../../constant";
import type { Github } from "../../type";

/**
 * 获取最近 10 个发布版本
 * @returns 最近 10 个发布版本
 */
export async function requestLatestReleaseVersionList(): Promise<Github.Api.GetReleases.Res> {
  const { owner, repo } = GithubRepo;
  if (!owner || !repo) {
    throw new Error("Github 仓库地址配置错误");
  }
  const params: Github.Api.GetReleases.Req = {
    owner,
    repo,
    per_page: 10
  };
  const paramsString = `per_page=${params.per_page}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?${paramsString}`;
  return (
    proxyRequest(url)
      .then(res => res.json())
      .then(json => json as Github.Api.GetReleases.Res)
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
          } as Github.Api.ReleaseVersion;
        });
      })
  );
}
