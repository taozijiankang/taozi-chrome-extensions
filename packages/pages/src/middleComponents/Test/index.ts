import { ifElementNode, parseHtml } from "@/utils/html";
import { parseCssWithRegex } from "../../utils/css";
import type { DefaultTreeAdapterTypes } from "parse5";

export function parseHtmlCss(html: string, css: string) {
  const htmlAst = parseHtml(html);

  const findBodyNode = (nodes: DefaultTreeAdapterTypes.ChildNode[]): DefaultTreeAdapterTypes.Element | undefined => {
    for (const node of nodes) {
      if (ifElementNode(node)) {
        if (node.tagName === "body") {
          return node;
        } else {
          const bodyNode = findBodyNode(node.childNodes);
          if (bodyNode) {
            return bodyNode;
          }
        }
      }
    }
    return undefined;
  };

  const bodyNode = findBodyNode(htmlAst);

  if (!bodyNode) {
    throw new Error("Body node not found");
  }
  const rootDivNode = bodyNode.childNodes?.[0];

  if (!rootDivNode || !ifElementNode(rootDivNode)) {
    throw new Error("Root div node not found");
  }

  rootDivNode.parentNode = null;

  const cssRules = parseCssWithRegex(css);

  return {
    htmlAst: rootDivNode,
    css: cssRules
  };
}
