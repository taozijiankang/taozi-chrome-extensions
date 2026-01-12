import { BaseCon, type BaseConConfig, type GetCodeOptions, type GetCodeReturn } from "./_BaseCon";
import type { VNode } from "vue";

export interface DivConConfig extends BaseConConfig<"div"> {}

export class DivCon extends BaseCon<DivConConfig> {
  static tagName = "div" as const;

  constructor(config?: Partial<Omit<DivConConfig, "tagName">>) {
    super({ ...config, tagName: DivCon.tagName });
  }

  protected getHtml(): VNode {
    return (
      <div class={this.classNames.join(" ")} style={this.lineStyle} data-key={this.key}>
        {this.children.map(child => child.renderHtml())}
      </div>
    );
  }

  protected getCode_(options?: GetCodeOptions): GetCodeReturn {
    const style = this.style;
    const class_ = this.classNames.join(" ");

    const childrenCode = this.children.map(item => item.getCode(options));

    let html = `<div class="${class_}">${childrenCode.map(item => item.html).join("\n")}</div>`;
    let css = `
    ${style.selector}{
      ${style.value}
    }
    ${childrenCode.map(item => item.css).join("\n")}
    `;
    let js = `
      ${childrenCode.map(item => item.js).join("\n")}
    `;

    return {
      html,
      css,
      js
    };
  }
}
