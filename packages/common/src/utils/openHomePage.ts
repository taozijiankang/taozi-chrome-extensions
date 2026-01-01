/**
 * 打开扩展主页
 */
export async function openHomePage() {
  const url = chrome.runtime.getURL("pages/home.html");

  // 检查是否已经打开了主页
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
