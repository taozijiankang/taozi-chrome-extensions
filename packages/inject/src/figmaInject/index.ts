import { debounce, retry } from "@taozi-chrome-extensions/common/src/utils/global";
import { getCodeExtensionSectionsEl, getViewCanvasEl } from "./elController";
import { insertMountEl } from "@/utils/insertMountEl";
import { renderComponentToEl } from "@/utils/renderComponentToEl";
import { h } from "vue";
import GenerateCode from "./components/GenerateCode/index.vue";

/**
 * figma 代码注入
 */
export function figmaInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      // 点击画布的地方
      if (e.target instanceof Node && getViewCanvasEl()?.contains(e.target)) {
        console.log("触发生成代码");
        retry(triggerFigma, 10, 100).catch((err) => {
          console.error("代码注入失败", err);
        });
      }
    }, 100),
    {
      capture: true,
    }
  );
}

async function triggerFigma() {
  const codeExtensionSectionsEl = getCodeExtensionSectionsEl();

  if (!codeExtensionSectionsEl) {
    throw new Error("代码扩展sections节点不存在");
  }

  const mountEl = await insertMountEl(
    codeExtensionSectionsEl.parentNode as Element,
    () => codeExtensionSectionsEl,
    "taozi-chrome-extensions-figma-custom-el-class"
  );
  if (!mountEl) {
    throw new Error("挂载节点不存在");
  }

  // 渲染组件
  await renderComponentToEl({
    mountEl,
    render: () => h(GenerateCode),
  });
}
