import { insertMountEl } from "@/utils/insertMountEl";
import SwitchAccountSearch from "./components/SwitchAccountSearch/index.vue";
import { h } from "vue";
import { renderComponentToEl } from "@/utils/renderComponentToEl";
import { getAccountItemList, getSwitchAccountPanel } from "./selector";
import { filter } from "@taozi-chrome-extensions/common/src/utils/fuzzy";

export async function weixinMpInject() {
  const switchAccountPanel = getSwitchAccountPanel();
  if (!switchAccountPanel) {
    return;
  }
  const mountEl = await insertMountEl(
    switchAccountPanel,
    () =>
      switchAccountPanel.querySelector<HTMLDivElement>(".account_list") ||
      switchAccountPanel.querySelector<HTMLDivElement>(".search_list")!,
    "taozi-chrome-extensions-weixin-mp-switch-account-search-custom-el-class"
  );

  if (mountEl) {
    await renderComponentToEl({
      mountEl,
      render: () =>
        h(SwitchAccountSearch, {
          onSearch: (value: string) => {
            const accountItemList = getAccountItemList();
            accountItemList.forEach((item) => {
              item.el.style.display = "none";
            });
            filter(value, accountItemList, {
              extract: (item) => item.data.name || "",
            })
              .map((item) => item.original)
              .forEach((item) => {
                item.el.style.display = "flex";
              });
          },
        }),
    });
  }
}
