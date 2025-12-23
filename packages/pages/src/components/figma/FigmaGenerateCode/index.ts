import type { BaseCode } from "./types";
import { camelToKebabCase, kebabToCamelCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";

export async function handleBaseCode(componentName: string, codes: BaseCode[]) {
  const htmlCode = codes.find(code => code.title === "index.html")?.content || "";
  const cssCode = codes.find(code => code.title === "index.css")?.content || "";

  if (!htmlCode || !cssCode) {
    return {
      html: "",
      css: ""
    };
  }

  const body = (htmlCode.match(/<body>([\s\S]*?)<\/body>/)?.[1] || "").trim().replace(/\t/g, " ");

  const rootNodeClassName = body.match(/^\s*<[\w]+\s*class="(.*?)"/)?.[1] || "";

  const componentVariableName = camelToKebabCase(toValidVariableName(componentName));

  const transformClassName = (className: string) => {
    if (className === rootNodeClassName) {
      return componentVariableName;
    }
    return camelToKebabCase(toValidVariableName(`figma-${className}`));
  };

  const css = cssCode.replace(/\.([\w-]+?)(?=\s*{)/g, (_, className) => {
    return `.${transformClassName(className)}`;
  });
  const cssRootNodeRegexp = new RegExp(`\\.${componentVariableName}\\s*{[\\s\\S]*?}`);
  const cssRootNodeExec = cssRootNodeRegexp.exec(css)!;

  const rootNodeCss = cssRootNodeExec[0]!.trim();

  return {
    html: await window.prettier.format(
      body.replace(/class="([\w-]+?)"/g, (_, className) => {
        return `class="${transformClassName(className)}"`;
      }),
      {
        parser: "html",
        plugins: window.prettierPlugins
      }
    ),
    scss: await window.prettier.format(
      rootNodeCss.replace(/}$/, () => {
        return `
          ${css.slice(0, cssRootNodeExec.index)}
          ${css.slice(cssRootNodeExec.index + cssRootNodeExec[0].length)}
      }`.trim();
      }),
      {
        parser: "scss",
        plugins: window.prettierPlugins
      }
    )
  };
}

export function getAssetsJsCode(option: { name: string; url: string; type: "image" | "icon" }) {
  const { name, url, type } = option;
  return `
    const ${kebabToCamelCase(toValidVariableName(`${name}-${type}`), true)} = \`${url}\`;
  `.trim();
}

export function toUniappCode(code: { html: string; scss: string }) {
  let { html, scss } = code;

  // 将html中的div标签替换为view标签
  html = html.replace(/(?<=<\/?)div/g, "view");

  // 将html的img标签替换为image标签
  html = html.replace(/(?<=<\/?)img/g, "image");

  return {
    html,
    scss
  };
}
