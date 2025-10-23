import { insertMountEl } from "@/utils/insertMountEl";
import SwitchAccountSearch from "./components/SwitchAccountSearch/index.vue";
import { h } from "vue";
import { renderComponentToEl } from "@/utils/renderComponentToEl";
import { getAccountItemList, getAccountList, getMenuBoxAccountInfo, getSwitchAccountPanel } from "./elController";
import { filter } from "@taozi-chrome-extensions/common/src/utils/fuzzy";
import { debounce, retry } from "@taozi-chrome-extensions/common/src/utils/global";
import { getWxaList } from "./api";
import type { WXMPItem } from "./api/type";
import { mpReleasePlanLocalStorage } from "@taozi-chrome-extensions/common/src/local/mpReleasePlan";

/**
 * 微信小程序注入
 */
export async function weixinMpInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      const target = e.target as HTMLDivElement;
      if (target instanceof HTMLDivElement && getMenuBoxAccountInfo()?.contains(target) && target.textContent === "切换账号") {
        console.log("触发切换账号");
        /**
         * 因为中间会调用接口所以重试总时长要设置长一点
         */
        retry(triggerSwitchAccount, 10, 1000).catch((err) => {
          console.error("切换账号注入失败", err);
        });
      }
    }, 100),
    {
      capture: true,
    }
  );
}

const wxaList: WXMPItem[] = [];

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

  if (wxaList.length === 0) {
    wxaList.push(...(await getWxaList()));
    /**
     * 获取小程序列表
     * 并更新本地存储
     */
    mpReleasePlanLocalStorage.edit((v) => {
      v.mpList?.forEach((item) => {
        const wxItem = wxaList.find((wxa) => wxa.appid === (item.appId || ""));
        if (wxItem) {
          item.name = wxItem.app_name;
          item.headimg = wxItem.app_headimg;
          item.username = wxItem.username;
          item.email = wxItem.email;
          item.type = wxItem.type;
        }
      });
    });
  }

  accountItemList.forEach((item) => {
    const wxItem = wxaList.find((wxa) => wxa.username === (item.data.originalId || ""));
    if (wxItem) {
      item.setInfo(wxItem);
    }
  });

  // 渲染组件
  await renderComponentToEl({
    mountEl,
    render: () =>
      h(SwitchAccountSearch, {
        wxaList,
        onSearch: async (value: string) => {
          const { mpList: mpReleasePlanList = [] } = (await mpReleasePlanLocalStorage.get()) || {};

          value = value.trim();
          accountItemList.forEach((item) => {
            item.show(false);
            item.planRelease(
              mpReleasePlanList.some(
                (mp) => mp.appId === wxaList.find((wxa) => wxa.username === (item.data.originalId || ""))?.appid
              )
            );
          });
          filter(value, accountItemList, {
            extract: (item) =>
              `${item.data.name}-${wxaList.find((wxa) => wxa.username === (item.data.originalId || ""))?.appid || ""}-${
                item.data.originalId
              }`,
          })
            .map((item) => item.original)
            .forEach((item) => {
              item.show(true);
            });
        },
      }),
  });
}
