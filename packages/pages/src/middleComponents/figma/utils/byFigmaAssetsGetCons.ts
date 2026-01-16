import type { FigmaAssetsExtendReq } from "@taozi-chrome-extensions/common/src/message";
import { parseHtmlCss } from "./parseHtmlCss";
import type { DefaultTreeAdapterTypes } from "parse5";
import {
  DivCon,
  ImageCon,
  TextCon,
  TextTagName,
  textTagNameList,
  type BaseCon
} from "../GenerateCode/components/CodeEditor/controller";
import { ifElementNode, ifTextNode } from "@/utils/html";

export function byFigmaAssetsGetCons(figmaAssetsReq: FigmaAssetsExtendReq): BaseCon | undefined {
  const htmlContent = figmaAssetsReq.codes.find(item => item.lang === "html")?.content;
  const cssContent = figmaAssetsReq.codes.find(item => item.lang === "css")?.content;
  const { htmlAst, css } = parseHtmlCss(htmlContent || "", cssContent || "");

  const getCon = (htmlAst: DefaultTreeAdapterTypes.Element): BaseCon | undefined => {
    const className = htmlAst.attrs.find(attr => attr.name === "class")?.value || "";
    const styleDeclarations = JSON.parse(JSON.stringify(css.find(item => item.selector === `.${className}`)?.declarations || []));

    let con: BaseCon | undefined;

    if (ifElementNode(htmlAst)) {
      if (htmlAst.tagName === "div") {
        const childNodes = htmlAst.childNodes.filter(item => {
          // 过滤掉空文本节点
          if (ifTextNode(item)) {
            return Boolean(item.value.trim());
          }
          return true;
        });
        // 如果只有一个文本节点，则直接返回文本节点
        if (childNodes.length === 1 && ifTextNode(childNodes[0])) {
          con = new TextCon(TextTagName.span, {
            name: className,
            styleProps: styleDeclarations,
            text: childNodes[0].value
          });
        } else {
          con = new DivCon({
            name: className,
            styleProps: styleDeclarations
          });
          con.children = childNodes.map(item => getCon(item as DefaultTreeAdapterTypes.Element)).filter(Boolean) as BaseCon[];
        }
      } else if (htmlAst.tagName === "img") {
        con = new ImageCon({
          name: className,
          styleProps: styleDeclarations,
          src: htmlAst.attrs.find(attr => attr.name === "src")?.value || "",
          alt: htmlAst.attrs.find(attr => attr.name === "alt")?.value || ""
        });
      }
      // 文本节点
      else if (textTagNameList.includes(htmlAst.tagName as TextTagName)) {
        const childNodes = htmlAst.childNodes.filter(item => {
          // 过滤掉空文本节点
          if (ifTextNode(item)) {
            return Boolean(item.value.trim());
          }
          return true;
        });
        // 如果所有子节点都是文本节点
        if (childNodes.every(item => ifTextNode(item))) {
          con = new TextCon(htmlAst.tagName as TextTagName, {
            name: className,
            styleProps: styleDeclarations,
            text: childNodes.map(item => item.value).join("")
          });
        }
      }
    }

    return con;
  };

  const con = getCon(htmlAst);

  // 在根节点上添加图片资产
  if (con) {
    con.config.imageAssets = figmaAssetsReq.images.map(item => item.url);
  }
  return con;
}
