import { BaseCon, type BaseConConfig } from "./_BaseCon";
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
        {this.children?.map(child => child.renderHtml())}
      </div>
    );
  }
}
