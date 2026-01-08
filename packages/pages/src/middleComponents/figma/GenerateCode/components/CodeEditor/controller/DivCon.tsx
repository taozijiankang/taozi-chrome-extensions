import { BaseCon, type BaseConProps } from "./_BaseCon";
import type { VNode } from "vue";

export interface DivConProps extends BaseConProps<"div"> {}

export class DivCon extends BaseCon {
  static tagName = "div" as const;

  constructor(public readonly props: DivConProps) {
    super({ ...props, tagName: DivCon.tagName });
  }

  renderHtml(): VNode {
    return (
      <div class={this.className} style={this.lineStyle}>
        {this.children?.map(child => child.renderHtml())}
      </div>
    );
  }

  static getCon(props: Omit<DivConProps, "tagName">): DivCon {
    return new DivCon({ ...props, tagName: DivCon.tagName });
  }
}
