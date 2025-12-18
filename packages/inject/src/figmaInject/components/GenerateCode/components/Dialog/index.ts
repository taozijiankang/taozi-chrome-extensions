import type { BaseCode } from "@/figmaInject/types";
import { camelToKebabCase, kebabToCamelCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";

export function handleBaseCode(componentName: string, codes: BaseCode[]) {
  const htmlCode = codes.find((code) => code.title === "index.html")?.content || "";
  const cssCode = codes.find((code) => code.title === "index.css")?.content || "";

  const body = (htmlCode.match(/<body>([\s\S]*?)<\/body>/)?.[1] || "").trim();

  const rootNodeClassName = body.match(/^\s*<[\w]+\s*class="(.*?)"/)?.[1] || "";

  const componentVariableName = camelToKebabCase(toValidVariableName(`ai-${componentName}`));

  const transformClassName = (className: string) => {
    if (className === rootNodeClassName) {
      return componentVariableName;
    }
    return camelToKebabCase(toValidVariableName(`ai-${className}`));
  };

  const css = cssCode.replace(/\.([\w-]+?)(?=\s*{)/g, (_, className) => {
    return `.${transformClassName(className)}`;
  });
  const cssRootNodeRegexp = new RegExp(`\\.${componentVariableName}\\s*{[\\s\\S]*?}`);
  const cssRootNodeExec = cssRootNodeRegexp.exec(css)!;

  const rootNodeCss = cssRootNodeExec[0]!.trim();

  return {
    html: body.replace(/class="([\w-]+?)"/g, (_, className) => {
      return `class="${transformClassName(className)}"`;
    }),
    css: rootNodeCss.replace(/}$/, () => {
      return `
          ${css.slice(0, cssRootNodeExec.index)}
          ${css.slice(cssRootNodeExec.index + cssRootNodeExec[0].length)}
      }`.trim();
    }),
  };
}

export function getAssetsJsCode(option: { name: string; ossUrl: string }) {
  const { name, ossUrl } = option;
  return `
    const ${kebabToCamelCase(toValidVariableName(name), true)} = \`${ossUrl}\`;
  `.trim();
}
