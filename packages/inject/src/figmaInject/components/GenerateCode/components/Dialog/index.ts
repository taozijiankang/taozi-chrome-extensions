import { camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";

const ROOT_CLASS_NAME = "frame-parent";

export function handleHtmlCode(componentName: string, html: string) {
  if (!html) return "";
  const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1] || "";
  const componentVariableName = camelToKebabCase(toValidVariableName(`ai-${componentName}`));
  return body.replace(/class="([\w-]+?)"/g, (_, className) => {
    if (className === ROOT_CLASS_NAME) {
      return `class="${componentVariableName}"`;
    }
    return `class="${camelToKebabCase(toValidVariableName(`ai-${className}`))}"`;
  });
}

export function handleCssCode(componentName: string, css: string) {
  if (!css) return "";
  const componentVariableName = camelToKebabCase(toValidVariableName(`ai-${componentName}`));
  css = css.replace(/\.([\w-]+?)(?=\s*{)/g, (_, className) => {
    if (className === ROOT_CLASS_NAME) {
      return `.${componentVariableName}`;
    }
    return `.${camelToKebabCase(toValidVariableName(`ai-${className}`))}`;
  });
  const rootNodeRegexp = new RegExp(`\\.${componentVariableName}\\s*{[\\s\\S]*?}`);
  const rootNodeExec = rootNodeRegexp.exec(css)!;

  const rootNodeCss = rootNodeExec[0]!.trim();

  return rootNodeCss.replace(/}$/, () => {
    return `
        ${css.slice(0, rootNodeExec.index)}
        ${css.slice(rootNodeExec.index + rootNodeExec[0].length)}
    }`.trim();
  });
}
