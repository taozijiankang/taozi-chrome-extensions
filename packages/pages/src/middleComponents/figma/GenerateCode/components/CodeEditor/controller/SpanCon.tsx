import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type RenderEditorOptions } from "./_BaseCon";
import TextEditor from "../components/TextEditor/index.vue";

export interface SpanConConfig extends BaseConConfig<"span"> {
  text: string;
}

export enum SpanEditorType {
  text = "text"
}

export class SpanCon extends BaseCon<SpanConConfig> {
  static tagName = "span" as const;

  constructor(config?: Partial<Omit<SpanConConfig, "tagName">>) {
    super({ ...config, tagName: SpanCon.tagName });

    const { text } = config ?? {};
    this.config.text = text ?? "";
  }

  protected getHtml(): VNode {
    return (
      <span class={this.classNames.join(" ")} style={this.lineStyle} data-key={this.key}>
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
}
