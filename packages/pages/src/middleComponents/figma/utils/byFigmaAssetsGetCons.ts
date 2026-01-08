import type { FigmaAssetsExtendReq } from "@taozi-chrome-extensions/common/src/message";
import { parseHtmlCss } from "./parseHtmlCss";
import type { DefaultTreeAdapterTypes } from "parse5";
import { DivCon, ImageCon, SpanCon, type BaseCon } from "../GenerateCode/components/CodeEditor/controller";
import { ifElementNode, ifTextNode } from "@/utils/html";

export function byFigmaAssetsGetCons(figmaAssetsReq: FigmaAssetsExtendReq) {
  const htmlContent = figmaAssetsReq.codes.find(item => item.lang === "html")?.content;
  const cssContent = figmaAssetsReq.codes.find(item => item.lang === "css")?.content;
  const { htmlAst, css } = parseHtmlCss(htmlContent || "", cssContent || "");

  const getCon = (htmlAst: DefaultTreeAdapterTypes.Element): BaseCon | undefined => {
    const className = htmlAst.attrs.find(attr => attr.name === "class")?.value || "";
    const styleDeclarations = css.find(item => item.selector === `.${className}`)?.declarations;

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
          con = SpanCon.getCon({
            name: className,
            styleProps: styleDeclarations,
            text: childNodes[0].value
          });
        } else {
          con = DivCon.getCon({
            name: className,
            styleProps: styleDeclarations
          });
          con.children = childNodes.map(item => getCon(item as DefaultTreeAdapterTypes.Element)).filter(Boolean) as BaseCon[];
        }
      } else if (htmlAst.tagName === "img") {
        con = ImageCon.getCon({
          name: className,
          styleProps: styleDeclarations,
          src: htmlAst.attrs.find(attr => attr.name === "src")?.value || "",
          alt: htmlAst.attrs.find(attr => attr.name === "alt")?.value || ""
        });
      }
    }

    return con;
  };

  return getCon(htmlAst);
}
