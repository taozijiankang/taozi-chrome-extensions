import { debounce, retry } from "@taozi-chrome-extensions/common/src/utils/global";
import { getCodePanelInspectionPanelEl, getViewCanvasEl } from "./elController";
import { insertMountEl } from "@/utils/insertMountEl";
import { renderComponentToEl } from "@/utils/renderComponentToEl";
import { h } from "vue";
import SendAssets from "./components/SendAssets/index.vue";

/**
 * figma 代码注入
 */
export function figmaInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      // 点击画布
      if (e.target instanceof Node && getViewCanvasEl()?.contains(e.target)) {
        retry(triggerFigmaInject, 10, 100).catch(err => {
          console.error("代码注入失败", err);
        });
      }
    }, 100),
    {
      capture: true
    }
  );
}

async function triggerFigmaInject() {
  const codePanelInspectionPanelEl = getCodePanelInspectionPanelEl();
  if (!codePanelInspectionPanelEl) {
    throw new Error("代码检查面板不存在");
  }

  const mountEl = await insertMountEl(
    codePanelInspectionPanelEl.parentElement!,
    () => codePanelInspectionPanelEl,
    "taozi-chrome-extensions-figma-inject-custom-el-class"
  );
  if (!mountEl) {
    throw new Error("挂载节点不存在");
  }

  await renderComponentToEl({
    mountEl,
    render: () => h(SendAssets)
  });
}
