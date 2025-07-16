import { packageJson } from "taozi-chrome-extensions/src/packageJson";

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
