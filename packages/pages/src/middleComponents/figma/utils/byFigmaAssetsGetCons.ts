import type { FigmaAssetsExtendReq } from "@taozi-chrome-extensions/common/src/message";
import { defaultTreeAdapter, parse, type DefaultTreeAdapterTypes } from "parse5";
import { DivCon, ImageCon, TextCon, type BaseCon } from "../GenerateCode/components/CodeEditor/controller";
import { parseCssWithRegex } from "@/utils/css";
import { TextTagName } from "../constant/enum";
import { textTagNameList } from "../constant";

export function byFigmaAssetsGetCons(figmaAssetsReq: FigmaAssetsExtendReq): BaseCon | undefined {
  const htmlContent = figmaAssetsReq.codes.find(item => item.lang === "html")?.content;
  const cssContent = figmaAssetsReq.codes.find(item => item.lang === "css")?.content;

  const { node: mainNode, cssRules } = parseFigmaAssetsHtmlAndCss(htmlContent || "", cssContent || "");

  const getClassName = (node: DefaultTreeAdapterTypes.Node): string => {
    if (defaultTreeAdapter.isElementNode(node)) {
      return node.attrs.find(attr => attr.name === "class")?.value || "";
    }
    return "";
  };
  const getStyleDeclarations = (node: DefaultTreeAdapterTypes.Node): { property: string; value: string }[] => {
    if (defaultTreeAdapter.isElementNode(node)) {
      return cssRules.find(item => item.selector === `.${getClassName(node)}`)?.declarations || [];
    }
    return [];
  };

  const getCon = (node: DefaultTreeAdapterTypes.Node): BaseCon | undefined => {
    let con: BaseCon | undefined;

    if (defaultTreeAdapter.isElementNode(node)) {
      if (node.tagName === "div") {
        con = new DivCon({
          name: getClassName(node),
          styleProps: getStyleDeclarations(node)
        });
        con.children = node.childNodes.map(item => getCon(item)).filter(Boolean) as BaseCon[];
      } else if (node.tagName === "img") {
        con = new ImageCon({
          name: getClassName(node),
          styleProps: getStyleDeclarations(node),
          src: node.attrs.find(attr => attr.name === "src")?.value || "",
          alt: node.attrs.find(attr => attr.name === "alt")?.value || ""
        });
      } else if (textTagNameList.includes(node.tagName as TextTagName)) {
        const text = node.childNodes
          .map(item => {
            if (defaultTreeAdapter.isTextNode(item)) {
              return item.value;
            }
            return "";
          })
          .join("")
          .trim();
        if (text) {
          con = new TextCon(node.tagName as TextTagName, {
            name: getClassName(node),
            styleProps: getStyleDeclarations(node),
            text
          });
        }
      }
    } else if (defaultTreeAdapter.isTextNode(node)) {
      const text = node.value.trim();
      if (text) {
        con = new TextCon(TextTagName.span, {
          name: getClassName(node),
          styleProps: getStyleDeclarations(node),
          text
        });
      }
    }

    return con;
  };

  const con = getCon(mainNode);

  // 在根节点上添加图片资产
  if (con) {
    con.config.imageAssets = figmaAssetsReq.images.map(item => item.url);
  }
  return con;
}

export function parseFigmaAssetsHtmlAndCss(html: string, css: string) {
  const documentNode = parse(html);

  const hasChildNodes = (
    node: DefaultTreeAdapterTypes.Node
  ): node is DefaultTreeAdapterTypes.Document | DefaultTreeAdapterTypes.DocumentFragment | DefaultTreeAdapterTypes.Element => {
    return node.nodeName === "#document" || node.nodeName === "#document-fragment" || defaultTreeAdapter.isElementNode(node);
  };

  const findBodyNode = (node: DefaultTreeAdapterTypes.Node): DefaultTreeAdapterTypes.Element | undefined => {
    if (defaultTreeAdapter.isElementNode(node)) {
      if (node.tagName === "body") {
        return node;
      }
    }
    if (hasChildNodes(node)) {
      for (const childNode of node.childNodes) {
        const bodyNode = findBodyNode(childNode);
        if (bodyNode) {
          return bodyNode;
        }
      }
    }
    return undefined;
  };

  const bodyNode = findBodyNode(documentNode);

  if (!bodyNode) {
    throw new Error("Body node not found");
  }

  /**
   * figma html-css 插件会把ui内容放到body的第一个div子节点，所以我们需要找到这个div节点
   */
  const rootDivNode = bodyNode.childNodes.find(item => defaultTreeAdapter.isElementNode(item) && item.tagName === "div");

  if (!rootDivNode || !defaultTreeAdapter.isElementNode(rootDivNode)) {
    throw new Error("Root div node not found");
  }

  /**
   * 移除和body的连接
   */
  rootDivNode.parentNode = null;

  const cssRules = parseCssWithRegex(css);

  return {
    node: rootDivNode,
    cssRules
  };
}
