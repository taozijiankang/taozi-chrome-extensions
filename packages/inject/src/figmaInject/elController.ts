import { wait } from "@taozi-chrome-extensions/common/src/utils/global";
import type { Asset, BaseCode } from "./types";

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
 * 获取资产检查面板元素
 * @returns 获取资产检查面板元素
 */
export function getAssetsInspectorPanelEl() {
  return document.querySelector<HTMLDivElement>("#assets-inspection-panel");
}

/**
 * 获取基础代码
 * @returns 获取基础代码
 */
export async function getBaseCodes() {
  const inspectionPanelEl = getCodePanelInspectionPanelEl();

  if (!inspectionPanelEl) {
    throw new Error("检查面板不存在");
  }

  const codeLanguageDropdownButtonEl = inspectionPanelEl.querySelector(`button[data-testid="code_language_dropdown"]`);

  if (!codeLanguageDropdownButtonEl) {
    throw new Error("代码语言下拉按钮不存在");
  }

  const pluginIconAlt = codeLanguageDropdownButtonEl.querySelector("img")?.alt || "";
  const language =
    codeLanguageDropdownButtonEl.querySelector(`:scope > span[class*="fake-select--content--"]`)?.textContent || "";

  if (!/^Locofy Lightning/.test(pluginIconAlt) || !/^HTML\/CSS$/.test(language)) {
    throw new Error("请选择插件为Locofy Lightning，代码语言为HTML/CSS");
  }

  const codeExtensionSectionsEl = inspectionPanelEl.querySelector<HTMLDivElement>(
    `[class*="code_extension_section--sections--"]`
  );
  if (!codeExtensionSectionsEl) {
    throw new Error("代码扩展部分不存在");
  }

  const codeContainerEls = [
    ...codeExtensionSectionsEl.querySelectorAll<HTMLDivElement>(
      `:scope > div[class*="code_extension_section--sectionsContainer--"]`
    )
  ];

  // 先展开code全部内容
  codeContainerEls.forEach(codeContainerEl => {
    const showMoreButton = codeContainerEl.querySelector<HTMLButtonElement>('button[data-testid="show-more-button"]');
    if (showMoreButton) {
      showMoreButton.click();
    }
  });

  await wait(100);

  // 获取内容
  return codeContainerEls.map<BaseCode>(codeContainerEl => {
    const title =
      codeContainerEl.querySelector<HTMLHeadElement>('h3[data-testid="devHandoffFocusPanelTitle"]')?.textContent || "";
    const codeEl = codeContainerEl.querySelector<HTMLElement>('code[class*="code_panel--generatedCode--"]');
    const content = codeEl?.textContent || "";
    const lang = codeEl?.dataset?.["lang"] || "";
    return {
      title,
      lang,
      content
    };
  });
}

export async function getAssets() {
  const assetsInspectorPanelEl = getAssetsInspectorPanelEl();
  if (!assetsInspectorPanelEl) {
    return [];
  }

  const iconsInspectionPanelEl = document.querySelector<HTMLDivElement>("#icons-inspection-panel");
  const imagesInspectionPanelEl = document.querySelector<HTMLDivElement>("#images-inspection-panel");

  const getResult = async (panelEl: HTMLDivElement | null, type: "icon" | "image") => {
    if (!panelEl) {
      return [];
    }
    const assetsContentsEl = panelEl.querySelector(`div[class*="inspection_panel--inspectionPanelContents--"]`);
    if (!assetsContentsEl) {
      return [];
    }

    const showMoreButton = assetsContentsEl.querySelector<HTMLButtonElement>('button[data-testid="show-more-button"]');
    if (showMoreButton) {
      showMoreButton.click();
    }

    await wait(100);

    const assetsContainers = [
      ...assetsContentsEl.querySelectorAll<HTMLDivElement>('div[class*="asset_panel--assetContainer--"]')
    ];

    return assetsContainers.map<Asset>(assetsContainerEl => {
      const src = assetsContainerEl.querySelector<HTMLImageElement>("img")?.src || "";
      const detailsEl = assetsContainerEl.querySelector<HTMLDivElement>('div[class*="asset_panel--assetDetails--"]');

      const name = detailsEl?.querySelector("div[class*=asset_panel--assetName--]")?.textContent || "";
      const widthStr = detailsEl?.querySelector(`span[data-testid="assetPanelWidth"]`)?.textContent || "";
      const heightStr = detailsEl?.querySelector(`span[data-testid="assetPanelHeight"]`)?.textContent || "";
      const width = parseInt(widthStr.replace(",", ""));
      const height = parseInt(heightStr.replace(",", ""));
      return {
        type,
        src,
        name,
        width,
        height
      };
    });
  };

  const result = [...(await getResult(iconsInspectionPanelEl, "icon")), ...(await getResult(imagesInspectionPanelEl, "image"))];

  // 如果存在没有src的资产，则重新获取
  if (result.some(item => !item.src)) {
    return await getAssets();
  }
  return result;
}
