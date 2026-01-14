import { ConGenCodeType } from "../constants/enum";
import { BaseCon, type BaseConConfig, type GetCodeOptions, type GetCodeReturn } from "./_BaseCon";
import type { VNode } from "vue";

export enum DivTagName {
  div = "div"
}

export interface DivConConfig extends BaseConConfig<DivTagName> {}

export class DivCon extends BaseCon<DivConConfig> {
  constructor(config?: Partial<Omit<DivConConfig, "tagName">>) {
    super({ ...config, tagName: DivTagName.div });
  }

  protected getHtml(): VNode {
    return (
      <div class={this.classNames.join(" ")} style={this.lineStyle} data-key={this.key}>
        {this.children.map(child => child.renderHtml())}
      </div>
    );
  }

  protected getCode_(options?: GetCodeOptions): GetCodeReturn {
    const { type: codeType = ConGenCodeType.Default } = options || {};

    const style = this.style;
    const class_ = this.classNames.join(" ");

    const childrenCode = this.children.filter(item => !item.config.disabled).map(item => item.getCode(options));

    let html = "";
    let css = "";
    let js = `
      ${childrenCode.map(item => item.js).join("\n")}
    `;

    if (codeType === ConGenCodeType.Default || codeType === ConGenCodeType.VuePC) {
      html = `<div class="${class_}">
        ${childrenCode.map(item => item.html).join("\n")}
      </div>`;
    } else if (codeType === ConGenCodeType.VueUni) {
      html = `<view class="${class_}">
        ${childrenCode.map(item => item.html).join("\n")}
      </view>`;
    }

    if (codeType === ConGenCodeType.Default) {
      css = `
        ${style.selector}{
          ${style.value}
        }
        ${childrenCode.map(item => item.css).join("\n")}
    `;
    } else if (codeType === ConGenCodeType.VuePC || codeType === ConGenCodeType.VueUni) {
      css = `
        ${style.selector}{
          ${style.value}
          
          ${childrenCode.map(item => item.css).join("\n")}
        }
    `;
    }

    return {
      html,
      css,
      js
    };
  }
}
