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
    .map((item) => {
      item.style.height = "auto";
      item.style.padding = "6px 8px";
      item.style.position = "relative";

      return {
        on: item.querySelector<HTMLDivElement>(".current_login"),
        data: {
          originalId: item.querySelector<HTMLDivElement>(".account_email")?.textContent,
        },
        show: (value: boolean) => {
          item.style.display = value ? "flex" : "none";
        },
        setContent: (op: { planRelease: boolean; appId: string }) => {
          const injectElClass = "taozi-chrome-extensions-weixin-mp-switch-account-search-custom-el-class";
          let injectEl = item.querySelector<HTMLDivElement>(`.${injectElClass}`);
          if (injectEl) {
            injectEl.remove();
          }
          injectEl = document.createElement("div");
          injectEl.classList.add(injectElClass);
          injectEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 4px;">
              ${op.appId ? `<span style="color: #7E8081;font-size: 15px;">AppId: ${op.appId}</span>` : ""}
              ${
                op.planRelease
                  ? `<span style="
                  color: white;
                  font-size: 12px;
                  background-color: #f08a5d;
                  padding: 0 3px;
                  border-radius: 5px;
                ">待发版</span>`
                  : ""
              }
            </div>
          `;
          item.querySelector<HTMLDivElement>(".account_item_detail")?.appendChild(injectEl);
          item.style.position = "relative";
        },
      };
    });
}
