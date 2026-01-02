import { Page, PageUrlMap } from "../constant/page";

/**
 * 打开页面
 */
export async function openPage(page: Page) {
  const pageUrl = PageUrlMap[page];
  if (!pageUrl) {
    throw new Error(`page ${page} not found`);
  }

  const url = chrome.runtime.getURL(pageUrl);

  // 检查是否已经打开了页面
  const tabs = await chrome.tabs.query({});
  const existingTab = tabs.find(tab => tab.url === url);

  if (existingTab && existingTab.id) {
    // 如果已经打开，则激活该标签页
    await chrome.tabs.update(existingTab.id, { active: true });
    await chrome.windows.update(existingTab.windowId || 0, { focused: true });
  } else {
    // 如果未打开，则创建新标签页
    await chrome.tabs.create({ url });
  }
}
