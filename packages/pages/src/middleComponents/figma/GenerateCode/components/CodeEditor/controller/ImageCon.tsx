import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type GetCodeOptions, type GetCodeReturn, type RenderEditorOptions } from "./_BaseCon";
import ImageEditor from "../components/ImageEditor/index.vue";
import { ConGenCodeType, UniappImageModeType } from "../constants/enum";
import { kebabToCamelCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";

export enum ImageTagName {
  img = "img"
}

export interface ImageConConfig extends BaseConConfig<ImageTagName> {
  src: string;
  uniappConfig: {
    mode: UniappImageModeType;
  };
}

export enum ImageEditorType {
  image = "image"
}

export class ImageCon extends BaseCon<ImageConConfig> {
  constructor(config?: Partial<Omit<ImageConConfig, "tagName">>) {
    super({ ...config, tagName: ImageTagName.img });

    const { src, uniappConfig } = config ?? {};
    this.config.src = src ?? "";
    this.config.uniappConfig = uniappConfig ?? {
      mode: UniappImageModeType.ScaleToFill
    };
  }

  getPrompt() {
    return `
    <img class="${this.mainClassName}" src="${this.config.src}" alt="${this.config.description}" data-key="${this.key}" />
    `;
  }

  protected getHtml(): VNode {
    return (
      <img
        class={this.classNames.join(" ")}
        style={this.lineStyle}
        src={this.config.src}
        alt={this.config.description}
        data-key={this.key}
      />
    );
  }

  protected getEditor(options?: RenderEditorOptions) {
    const editor = super.getEditor(options);
    const getImageAssets = (con?: BaseCon): string[] => {
      if (!con) {
        return [];
      }
      return [...con.config.imageAssets, ...getImageAssets(con.parent?.())];
    };
    editor.push({
      type: ImageEditorType.image,
      component: <ImageEditor con={this} imageAssets={getImageAssets(this)} />
    });
    return editor;
  }

  protected getCode_(options?: GetCodeOptions): GetCodeReturn {
    const { type: codeType = ConGenCodeType.Default } = options || {};

    const style = this.style;
    const class_ = this.classNames.join(" ");

    const variableName = kebabToCamelCase(toValidVariableName(this.config.name), true);

    let html = "";

    let css = `
    ${style.selector}{
      ${style.value}
    }
    `;
    let js = "";

    if (codeType === ConGenCodeType.Default) {
      html = `<img class="${class_}" src="${this.config.src}" alt="${this.config.description}" />`;
    } else if (codeType === ConGenCodeType.VuePC) {
      html = `<img class="${class_}" :src="${variableName}" alt="${this.config.description}" />`;
    } else if (codeType === ConGenCodeType.VueUni) {
      html = `<image class="${class_}" mode="${this.config.uniappConfig.mode}" :src="${variableName}" alt="${this.config.description}" />`;
    }

    if (codeType === ConGenCodeType.VuePC || codeType === ConGenCodeType.VueUni) {
      js = `const ${variableName} = \`${this.config.src}\`;`;
    }

    return {
      html,
      css,
      js
    };
  }
}
