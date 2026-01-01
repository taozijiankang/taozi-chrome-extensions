import { parse as parseHtml } from "parse5";
import { parseCssWithRegex } from "../../utils/css";

export function parseHtmlScss(html: string, css: string) {
  const htmlAst = parseHtml(html);
  const cssAst = parseCssWithRegex(css);
  return {
    html: htmlAst,
    css: cssAst
  };
}
