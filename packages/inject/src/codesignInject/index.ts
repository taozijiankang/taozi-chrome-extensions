import Controller from "./components/Controller/index.vue";
import { getAllSectionNodeBox, getCssCode, getScreenInspectorEl, getTextContent, getIconSrc, isImgFill } from "./elController";
import { debounce, retry } from "@taozi-chrome-extensions/common/src/utils/global";
import { insertMountEl } from "../utils/insertMountEl";
import { renderComponentToEl } from "@/utils/renderComponentToEl";
import { h } from "vue";
import { ElType } from "./components/Controller";
import { md5 } from "@taozi-chrome-extensions/common/src/utils/md5";

/**
 * codesign代码注入
 */
export function codesignInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      // 点击非操作面板的地方
      if (e.target instanceof Node && getScreenInspectorEl()?.contains(e.target)) {
        return;
      }
      console.log("触发代码设计");
      retry(triggerCodesign, 10, 100).catch((err) => {
        console.error("代码注入失败", err);
      });
    }, 100),
    {
      capture: true,
    }
  );
}

async function triggerCodesign() {
  const sectionNodeBoxs = getAllSectionNodeBox();
  const codeSectionNode = sectionNodeBoxs.find((item) => item.title === "代码");
  if (!codeSectionNode) {
    throw new Error("代码节点不存在");
  }

  const mountEl = await insertMountEl(
    codeSectionNode.contentEl,
    () => codeSectionNode.contentEl.firstChild as Element,
    "taozi-chrome-extensions-codesign-custom-el-class"
  );
  if (!mountEl) {
    throw new Error("挂载节点不存在");
  }

  const topTitle = sectionNodeBoxs[0].title;
  const cssCode = getCssCode(codeSectionNode.contentEl);

  let elType: ElType = ElType.Div;
  let textContent: string = "";
  let identification: string = "";

  if (sectionNodeBoxs.some((item) => item.title === "文本")) {
    elType = ElType.Text;
    const textSectionNode = sectionNodeBoxs.find((item) => item.title === "内容")?.contentEl;
    if (textSectionNode) {
      textContent = getTextContent(textSectionNode);
    }
  } else if (sectionNodeBoxs.some((item) => item.title === "切图")) {
    elType = ElType.Icon;
    const iconSectionNode = sectionNodeBoxs.find((item) => item.title === "切图")?.contentEl;
    if (iconSectionNode) {
      const iconSrc = getIconSrc(iconSectionNode);
      identification = md5(iconSrc + cssCode).toString();
    }
  } else if (isImgFill(sectionNodeBoxs)) {
    elType = ElType.Img;
  } else {
    elType = ElType.Div;
  }

  if (elType === ElType.Text) {
    identification = md5(textContent + cssCode).toString();
  } else {
    identification = md5(topTitle + cssCode).toString();
  }

  // 缩短一下identification
  identification = identification.slice(0, 10);

  // 渲染组件
  await renderComponentToEl({
    mountEl,
    render: () =>
      h(Controller, {
        identification,
        elType,
        textContent,
        cssCode,
      }),
  });
}
