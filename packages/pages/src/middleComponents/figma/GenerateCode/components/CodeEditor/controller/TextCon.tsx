import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type GetCodeOptions, type GetCodeReturn, type RenderEditorOptions } from "./_BaseCon";
import TextEditor from "../components/TextEditor/index.vue";
import { ConGenCodeType } from "../constants/enum";
import type { TextTagName } from "@/middleComponents/figma/constant/enum";

export interface TextConConfig extends BaseConConfig<TextTagName> {
  text: string;
}

export enum SpanEditorType {
  text = "text"
}

export class TextCon extends BaseCon<TextConConfig> {
  constructor(tagName: TextTagName, config?: Partial<Omit<TextConConfig, "tagName">>) {
    super({ ...config, tagName });

    const { text } = config ?? {};
    this.config.text = text ?? "";
  }

  get searchKeyword() {
    return [...super.searchKeyword, this.config.text];
  }

  getPrompt() {
    return `
    <!-- ${this.config.description} -->
    <span ${[
      //
      `class="${this.mainClassName}"`,
      `style="${this.lineStyle}"`,
      `data-key="${this.key}"`
    ].join(" ")} >
      ${this.config.text}
    </span>
    `;
  }

  protected getHtml(): VNode {
    const Tag = this.config.tagName;
    return (
      <Tag class={this.classNames.join(" ")} style={this.lineStyle} data-key={this.key}>
        {this.config.text}
      </Tag>
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

    const tagName = this.config.tagName;
    if (codeType === ConGenCodeType.Default || codeType === ConGenCodeType.VuePC) {
      html = `<${tagName} class="${class_}">
      ${this.config.text}
    </${tagName}>`;
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
