export namespace Github {
  export namespace Api {
    /**
     * 发布版本
     */
    export interface ReleaseVersion {
      url: string;
      html_url: string;
      name: string;
      tag_name: string;
      body: string;
      created_at: string;
      published_at: string;
      target_commitish: string;
      assets?: {
        browser_download_url: string;
        name: string;
        content_type: string;
      }[];
    }
    export namespace GetReleases {
      export interface Req {
        owner: string;
        repo: string;
        per_page: number;
      }
      export type Res = ReleaseVersion[];
    }
  }
}
