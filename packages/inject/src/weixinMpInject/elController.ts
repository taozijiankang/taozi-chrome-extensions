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
      planRelease: (value: boolean) => {
        item.querySelector<HTMLDivElement>(".plan_release")?.remove();
        if (value) {
          const planReleaseEl = document.createElement("div");
          planReleaseEl.innerHTML = `
            <span style="color: #07C160;font-size: 12px;">已添加到发版计划</span>
          `;
          planReleaseEl.classList.add("plan_release");
          item
            .querySelector<HTMLDivElement>(".account_item_detail")
            ?.insertBefore(planReleaseEl, item.querySelector<HTMLDivElement>(".account_name_detail")?.nextSibling!);
        }
      },
      setInfo: (wxItem: WXMPItem) => {
        // item.querySelector<HTMLDivElement>(".account_username")?.remove();
        // const usernameEl = document.createElement("div");
        // usernameEl.innerHTML = `
        //   <span>${wxItem.username}</span>
        // `;
        // usernameEl.classList.add("account_username");
        // item.querySelector<HTMLDivElement>(".account_item_detail")?.insertBefore(usernameEl, null);
      },
    }));
}
