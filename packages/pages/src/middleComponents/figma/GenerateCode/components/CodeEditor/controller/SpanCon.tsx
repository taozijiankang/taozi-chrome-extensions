import { BaseCon, type BaseConProps, type RenderCodeProps } from "./_BaseCon";
import type { VNode } from "vue";

export interface SpanConProps extends BaseConProps<"span"> {
  text: string;
}

export class SpanCon extends BaseCon {
  static tagName = "span" as const;

  constructor(public readonly props: SpanConProps) {
    super(props);
  }

  renderHtml(): VNode {
    return (
      <span class={this.className} style={this.lineStyle}>
        {this.props.text}
      </span>
    );
  }

  static getCon(props: Omit<SpanConProps, "tagName">): SpanCon {
    return new SpanCon({ ...props, tagName: SpanCon.tagName });
  }
}
