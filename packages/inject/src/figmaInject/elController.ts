import { wait } from "@taozi-chrome-extensions/common/src/utils/global";

/**
 * 获取 figma 画布元素
 * @returns 获取画布元素
 */
export function getViewCanvasEl() {
  return document.querySelector<HTMLDivElement>(".view.gpu-view-content>canvas");
}

/**
 * 获取代码面板检查面板
 * @returns 获取检查面板元素
 */
export function getCodePanelInspectionPanelEl() {
  return document.querySelector<HTMLDivElement>("#code_panel-inspection-panel");
}

/**
 * 获取代码扩展sections元素
 * @returns 获取代码扩展sections元素
 */
export function getCodeExtensionSectionsEl() {
  return getCodePanelInspectionPanelEl()?.querySelector<HTMLDivElement>(`[class*="code_extension_section--sections--"]`);
}

/**
 * 获取基础代码
 * @returns 获取基础代码
 */
export async function getBaseCodes() {
  const codeLanguageDropdownButtonEl = getCodePanelInspectionPanelEl()?.querySelector(
    `button[data-testid="code_language_dropdown"]`
  );

  if (!codeLanguageDropdownButtonEl) {
    throw new Error("代码语言下拉按钮元素不存在");
  }

  const pluginIconAlt = codeLanguageDropdownButtonEl.querySelector("img")?.alt || "";
  const language =
    codeLanguageDropdownButtonEl.querySelector(`:scope > span[class*="fake-select--content--"]`)?.textContent || "";

  if (!/^Locofy Lightning/.test(pluginIconAlt) || !/^HTML\/CSS$/.test(language)) {
    throw new Error("请选择插件为Locofy Lightning，代码语言为HTML/CSS");
  }

  const codeExtensionSectionsEl = getCodeExtensionSectionsEl();
  if (!codeExtensionSectionsEl) {
    throw new Error("代码扩展sections元素不存在");
  }

  const codeContainerEls = [
    ...codeExtensionSectionsEl.querySelectorAll<HTMLDivElement>(
      `:scope > div[class*="code_extension_section--sectionsContainer--"]`
    ),
  ];

  // 先展开code全部内容
  codeContainerEls.forEach((codeContainerEl) => {
    const showMoreButton = codeContainerEl.querySelector<HTMLButtonElement>('button[data-testid="show-more-button"]');
    if (showMoreButton) {
      showMoreButton.click();
    }
  });

  await wait(100);

  // 获取内容
  return codeContainerEls.map((codeContainerEl) => {
    const title =
      codeContainerEl.querySelector<HTMLHeadElement>('h3[data-testid="devHandoffFocusPanelTitle"]')?.textContent || "";
    const codeEl = codeContainerEl.querySelector<HTMLElement>('code[class*="code_panel--generatedCode--"]');
    const content = codeEl?.textContent || "";
    const lang = codeEl?.dataset?.["lang"] || "";
    return {
      title,
      lang,
      content,
    };
  });
}
