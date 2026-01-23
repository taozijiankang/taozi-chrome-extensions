import rootPackageJson from "../../../package.json" with { type: "json" };

/**
 * manifest.json 配置文档
 * https://developer.chrome.com/docs/extensions/reference/manifest?hl=zh-cn
 */
export const MANIFEST = {
  name: rootPackageJson.name,
  description: rootPackageJson.description,
  version: rootPackageJson.version,
  manifest_version: 3,
  /**
   * 一个或多个表示您的扩展程序的图标。
   * https://developer.chrome.com/docs/extensions/reference/manifest/icons?hl=zh-cn
   */
  icons: {
    64: "images/icon-64.png",
    128: "images/icon-128.png"
  },
  /**
   * 定义 Google 工具栏中扩展程序图标的外观和行为。
   * https://developer.chrome.com/docs/extensions/reference/api/action?hl=zh-cn
   */
  action: {
    default_popup: "pages/popup.html",
    default_icon: {
      64: "images/icon-64.png",
      128: "images/icon-128.png"
    }
  },
  /**
   * 指定包含扩展程序的服务工件的 JavaScript 文件，该文件充当事件处理脚本。
   * https://developer.chrome.com/docs/extensions/develop/concepts/service-workers?hl=zh-cn
   */
  background: {
    service_worker: "background/index.iife.js",
    type: "module"
  },
  /**
   * 指定用户打开特定网页时要使用的 JavaScript 或 CSS 文件。
   * https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts?hl=zh-cn
   */
  content_scripts: [
    {
      matches: [
        // 腾讯 codesign
        "*://codesign.qq.com/*",
        // 微信小程序管理端
        "*://mp.weixin.qq.com/*",
        //
        "*://www.figma.com/*"
      ],
      js: ["inject/index.iife.js"],
      css: ["inject/index.css"],
      runAt: "document_idle"
    }
  ],
  /**
   * 启用特定扩展程序 API。
   * https://developer.chrome.com/docs/extensions/reference/api/permissions?hl=zh-cn
   */
  permissions: [
    "tabs",
    "scripting",
    "activeTab",
    "storage",
    /** 无限存储 */
    "unlimitedStorage",
    "cookies",
    "alarms"
  ],
  /**
   * 列出您的扩展程序可以与之互动的网页，这些网页是使用网址匹配模式定义的。系统会在安装时请求用户授予对这些网站的权限。
   * https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions?hl=zh-cn
   */
  host_permissions: ["<all_urls>"],
  /**
   * 定义一组不具有扩展程序 API 访问权限或对非沙盒化网页的直接访问权限的扩展程序网页。
   * https://developer.chrome.com/docs/extensions/reference/manifest/sandbox?hl=zh-cn
   */
  sandbox: {
    pages: ["sandbox/index.html"]
  },
  /**
   * 定义扩展程序中可供网页或其他扩展程序访问的文件。
   * https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources?hl=zh-cn
   */
  web_accessible_resources: [
    {
      resources: ["inject/index.css", "sandbox/index.html", "pages/home.html"],
      matches: ["*://*/*"]
    }
  ]
};
