export namespace Github {
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
    assets?: {
      browser_download_url: string;
      name: string;
      content_type: string;
    }[];
  }
}
