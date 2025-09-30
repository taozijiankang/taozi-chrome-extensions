import type { WXMPItem } from "./api/type";

export function getMenuBoxAccountInfo() {
  return document.querySelector<HTMLDivElement>(".menu_box_account_info");
}

export function getSwitchAccountPanel() {
  return document.querySelector<HTMLDivElement>(".switch_account_dialog>.switch_account_panel");
}

export function getAccountList() {
  return getSwitchAccountPanel()?.querySelector<HTMLDivElement>(".account_list");
}

export function getAccountItemList() {
  return [...(getAccountList()?.querySelectorAll<HTMLDivElement>(".account_item.account_item_gap") || [])]
    .filter(Boolean)
    .map((item) => ({
      el: item,
      on: item.querySelector<HTMLDivElement>(".current_login"),
      data: {
        logo: item.querySelector<HTMLImageElement>(".account_item_logo")?.src,
        name: item.querySelector<HTMLDivElement>(".account_name")?.textContent,
        originalId: item.querySelector<HTMLDivElement>(".account_email")?.textContent,
      },
      show: (value: boolean) => {
        item.style.display = value ? "flex" : "none";
      },
      setInfo: (wxItem: WXMPItem) => {
        const emailEl = item.querySelector<HTMLDivElement>(".account_email");
        if (emailEl) {
          emailEl.innerHTML = `${wxItem.appid} (${wxItem.username})`;
        }
      },
    }));
}
