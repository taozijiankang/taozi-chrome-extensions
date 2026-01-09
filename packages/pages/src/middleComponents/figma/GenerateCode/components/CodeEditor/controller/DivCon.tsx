import { BaseCon, type BaseConConfig } from "./_BaseCon";
import type { VNode } from "vue";

export interface DivConConfig extends BaseConConfig<"div"> {}

export class DivCon extends BaseCon {
  static tagName = "div" as const;

  constructor(public readonly config: DivConConfig) {
    super({ ...config, tagName: DivCon.tagName });
  }

  renderHtml(): VNode {
    return (
      <div class={this.className} style={this.lineStyle}>
        {this.children?.map(child => child.renderHtml())}
      </div>
    );
  }

  static getCon(config: Omit<DivConConfig, "tagName">): DivCon {
    return new DivCon({ ...config, tagName: DivCon.tagName });
  }
}
