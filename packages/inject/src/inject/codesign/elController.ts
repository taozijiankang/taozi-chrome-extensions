export interface SectionNodeBox {
  sectionNodeEl: HTMLDivElement;
  title: string;
  contentEl: HTMLDivElement;
}

export function getScreenInspectorEl() {
  return document.querySelector<HTMLDivElement>(".screen-inspector.inspector.expanded");
}

export function getAllSectionNodeBox() {
  let list: SectionNodeBox[] = [];
  getScreenInspectorEl()
    ?.querySelectorAll<HTMLDivElement>("section.node-box")
    .forEach((sectionNodeEl) => {
      const title = (sectionNodeEl.querySelector(".node-box__header .node-box__header--title")?.textContent || "").trim();
      const contentEl = sectionNodeEl.querySelector<HTMLDivElement>(".node-box__content")!;
      list.push({
        sectionNodeEl,
        title,
        contentEl,
      });
    });
  return list;
}

export function getCssCode(codeSectionNode: HTMLDivElement) {
  return codeSectionNode.querySelectorAll(".css-node__code--item")[0]?.textContent || "";
}

export function getTextContent(textSectionNode: HTMLDivElement) {
  return textSectionNode.querySelector(".textarea__node.node-item__input span")?.textContent || "";
}

export function getIconSrc(iconSectionNode: HTMLDivElement) {
  return iconSectionNode.querySelector<HTMLImageElement>(".thumb img")?.src || "";
}

export function isImgFill(sectionNodeBoxs: SectionNodeBox[]) {
  return sectionNodeBoxs.some(
    (item) =>
      item.title === "填充" &&
      [...item.contentEl.querySelectorAll("span.node-item__text")].some((item2) => item2.textContent?.trim() === "图片填充")
  );
}
