import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type GetCodeOptions, type GetCodeReturn, type RenderEditorOptions } from "./_BaseCon";
import TextEditor from "../components/TextEditor/index.vue";
import { ConGenCodeType } from "../constants/enum";

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

  protected getCode_(options?: GetCodeOptions): GetCodeReturn {
    const { type: codeType = ConGenCodeType.Default } = options || {};

    const style = this.style;

    const class_ = this.classNames.join(" ");

    let html = "";

    let css = `
    ${style.selector}{
      ${style.value}
    }
    `;

    if (codeType === ConGenCodeType.Default || codeType === ConGenCodeType.VuePC) {
      html = `<span class="${class_}">
      ${this.config.text}
    </span>`;
    } else if (codeType === ConGenCodeType.VueUni) {
      html = `<text class="${class_}">
      ${this.config.text}
    </text>`;
    }

    return {
      html,
      css,
      js: ""
    };
  }
}
