export enum Page {
  /** 主页页面 */
  Index = "index",
  /** 弹窗页面 */
  Popup = "popup",
  /** figma操作页面 */
  Figma = "figma"
}

export const PageUrlMap = {
  [Page.Index]: "pages/index.html",
  [Page.Popup]: "pages/popup.html",
  [Page.Figma]: "pages/figma.html"
};
