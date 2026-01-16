import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type GetCodeOptions, type GetCodeReturn, type RenderEditorOptions } from "./_BaseCon";
import TextEditor from "../components/TextEditor/index.vue";
import { ConGenCodeType } from "../constants/enum";

export enum TextTagName {
  span = "span",
  b = "b",
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6"
}

export const textTagNameList = [
  TextTagName.span,
  TextTagName.b,
  TextTagName.h1,
  TextTagName.h2,
  TextTagName.h3,
  TextTagName.h4,
  TextTagName.h5,
  TextTagName.h6
];

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
    <span class="${this.mainClassName}" data-key="${this.key}" alt="${this.config.description}">${this.config.text}</span>
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
