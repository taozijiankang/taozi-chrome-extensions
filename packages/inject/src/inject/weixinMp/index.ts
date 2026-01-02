import { insertMountEl } from "@/utils/insertMountEl";
import SwitchAccountSearch from "./components/SwitchAccountSearch/index.vue";
import { h } from "vue";
import { renderComponentToEl } from "@/utils/renderComponentToEl";
import { getAccountItemList, getAccountList, getMenuBoxAccountInfo, getSwitchAccountPanel } from "./elController";
import { filter } from "@taozi-chrome-extensions/common/src/utils/fuzzy";
import { debounce, retry } from "@taozi-chrome-extensions/common/src/utils/global";
import { getWxList } from "./middleware/getWxList";
import { weixinLocalStorage } from "@taozi-chrome-extensions/common/src/local/weixin";

/**
 * 微信小程序注入
 */
export async function weixinMpInject() {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    getWxList();
  } else {
    document.addEventListener("load", () => {
      getWxList();
    });
  }

  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      const target = e.target as HTMLDivElement;
      if (target instanceof HTMLDivElement && getMenuBoxAccountInfo()?.contains(target) && target.textContent === "切换账号") {
        /**
         * 因为中间会调用接口所以重试总时长要设置长一点
         */
        retry(triggerSwitchAccount, 10, 1000).catch(err => {
          console.error("切换账号注入失败", err);
        });
      }
    }, 100),
    {
      capture: true
    }
  );
}

/**
 * 触发切换账号
 * 触发时机：点击切换账号按钮
 */
async function triggerSwitchAccount() {
  const switchAccountPanel = getSwitchAccountPanel();
  if (!switchAccountPanel) {
    throw new Error("切换账号面板不存在");
  }
  const accountItemList = getAccountItemList();

  if (accountItemList.length === 0) {
    throw new Error("账号列表不存在");
  }

  const mountEl = await insertMountEl(
    switchAccountPanel,
    () => getAccountList()!,
    "taozi-chrome-extensions-weixin-mp-switch-account-search-custom-el-class"
  );
  if (!mountEl) {
    throw new Error("挂载节点不存在");
  }

  const wxaList = await getWxList();

  // 渲染组件
  await renderComponentToEl({
    mountEl,
    render: () =>
      h(SwitchAccountSearch, {
        wxaList,
        onSearch: async (value: string) => {
          const { mpReleasePlanList = [] } = (await weixinLocalStorage.get()) || {};

          value = value.trim();
          accountItemList.forEach(item => {
            item.show(false);
          });
          filter(value, accountItemList, {
            extract: item => {
              const wxItem = wxaList.find(wxa => wxa.username === (item.data.originalId || ""));
              return `${wxItem?.app_name || ""}-${wxItem?.appid || ""}-${wxItem?.username || ""}`;
            }
          })
            .map(item => item.original)
            .forEach(item => {
              item.show(true);

              const wxItem = wxaList.find(wxa => wxa.username === (item.data.originalId || ""));
              item.setContent({
                planRelease: mpReleasePlanList.some(mp => mp.appId === wxItem?.appid),
                appId: wxItem?.appid || ""
              });
            });
        }
      })
  });
}
