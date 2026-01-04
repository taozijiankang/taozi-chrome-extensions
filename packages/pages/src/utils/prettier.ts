import prettier from "prettier/standalone";
import estreePlugin from "prettier/plugins/estree";
import typescriptPlugin from "prettier/plugins/typescript";
import htmlPlugin from "prettier/plugins/html";
import postcssPlugin from "prettier/plugins/postcss";

export function formatCode(code: string, parser: "html" | "scss" | "typescript") {
  return prettier.format(code, {
    parser: parser,
    plugins: [estreePlugin, typescriptPlugin, htmlPlugin, postcssPlugin]
  });
}
