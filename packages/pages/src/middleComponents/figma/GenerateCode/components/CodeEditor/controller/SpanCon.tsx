import type { VNode } from "vue";
import { BaseCon, type BaseConConfig } from "./_BaseCon";

export interface SpanConConfig extends BaseConConfig<"span"> {
  text: string;
}

export class SpanCon extends BaseCon {
  static tagName = "span" as const;

  constructor(public readonly config: SpanConConfig) {
    super(config);
  }

  renderHtml(): VNode {
    return (
      <span class={this.className} style={this.lineStyle} data-key={this.key}>
        {this.config.text}
      </span>
    );
  }

  static getCon(config: Omit<SpanConConfig, "tagName">): SpanCon {
    return new SpanCon({ ...config, tagName: SpanCon.tagName });
  }
}
