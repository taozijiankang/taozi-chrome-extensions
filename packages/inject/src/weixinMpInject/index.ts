import { insertMountEl } from "@/utils/insertMountEl";
import SwitchAccountSearch from "./components/SwitchAccountSearch/index.vue";
import { h } from "vue";
import { renderComponentToEl } from "@/utils/renderComponentToEl";
import { getAccountItemList, getAccountList, getSwitchAccountPanel } from "./elController";
import { filter } from "@taozi-chrome-extensions/common/src/utils/fuzzy";
import { TRIGGER_RETRY_COUNT, TRIGGER_RETRY_DELAY } from "@/constant";
import { retry } from "@taozi-chrome-extensions/common/src/utils/global";

/**
 * 微信小程序注入
 */
export async function weixinMpInject() {
  retry(trigger, TRIGGER_RETRY_DELAY, TRIGGER_RETRY_COUNT).catch((err) => {
    console.error(err);
  });
}

async function trigger() {
  const switchAccountPanel = getSwitchAccountPanel();
  if (!switchAccountPanel) {
    console.error("切换账号面板不存在");
    throw new Error();
  }

  const mountEl = await insertMountEl(
    switchAccountPanel,
    () => getAccountList()!,
    "taozi-chrome-extensions-weixin-mp-switch-account-search-custom-el-class"
  );
  if (!mountEl) {
    console.error("挂载节点不存在");
    throw new Error();
  }

  // 渲染组件
  await renderComponentToEl({
    mountEl,
    render: () =>
      h(SwitchAccountSearch, {
        onSearch: (value: string) => {
          const accountItemList = getAccountItemList();
          accountItemList.forEach((item) => {
            item.show(false);
          });
          filter(value, accountItemList, {
            extract: (item) => `${item.data.name}-${item.data.originalId}`,
          })
            .map((item) => item.original)
            .forEach((item) => {
              item.show(true);
            });
        },
      }),
  });
}
