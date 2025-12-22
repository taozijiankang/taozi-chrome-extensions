import { packageJson } from "@taozi-chrome-extensions/scripts/src/packageJson.js";

export const MANIFEST = {
  name: packageJson.name,
  description: packageJson.description,
  version: packageJson.version,
  manifest_version: 3,
  action: {
    default_popup: "pages/popup.html",
    default_icon: {
      64: "images/icon-64.png",
      128: "images/icon-128.png"
    }
  },
  icons: {
    64: "images/icon-64.png",
    128: "images/icon-128.png"
  },
  background: {
    service_worker: "background/index.iife.js",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["*://codesign.qq.com/*", "*://mp.weixin.qq.com/*", "*://www.figma.com/*"],
      js: ["inject/index.iife.js"],
      css: ["inject/index.css"],
      runAt: "document_idle"
    }
  ],
  permissions: ["tabs", "scripting", "activeTab", "storage", "cookies"],
  host_permissions: ["<all_urls>"],
  sandbox: {
    pages: ["sandbox/index.html"]
  },
  web_accessible_resources: [
    {
      resources: ["inject/index.css", "sandbox/index.html"],
      matches: ["*://*/*"]
    }
  ]
};
