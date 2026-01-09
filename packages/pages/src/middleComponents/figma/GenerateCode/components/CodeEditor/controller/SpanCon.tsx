import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type RenderEditorOptions } from "./_BaseCon";
import TextEditor from "../components/TextEditor/index.vue";

export interface SpanConConfig extends BaseConConfig<"span"> {
  text: string;
}

export enum SpanEditorType {
  text = "text"
}

export class SpanCon extends BaseCon {
  static tagName = "span" as const;

  constructor(public readonly config: SpanConConfig) {
    super(config);
  }

  renderHtml(): VNode {
    if (this.disabled) {
      return <></>;
    }
    return (
      <span class={this.className} style={this.lineStyle} data-key={this.key}>
        {this.config.text}
      </span>
    );
  }

  protected getEditor(options?: RenderEditorOptions) {
    const editor = super.getEditor(options);
    editor.push({
      type: SpanEditorType.text,
      component: <TextEditor con={this} />
    });
    return editor;
  }

  static getCon(config: Omit<SpanConConfig, "tagName">): SpanCon {
    return new SpanCon({ ...config, tagName: SpanCon.tagName });
  }
}
