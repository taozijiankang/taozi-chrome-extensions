import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type GetCodeOptions, type GetCodeReturn, type RenderEditorOptions } from "./_BaseCon";
import ImageEditor from "../components/ImageEditor/index.vue";
import { UniappImageModeType } from "../constants/enum";
import { kebabToCamelCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";

export interface ImageConConfig extends BaseConConfig<"img"> {
  src: string;
  alt: string;
  uniappConfig: {
    mode: UniappImageModeType;
  };
}

export enum ImageEditorType {
  image = "image"
}

export class ImageCon extends BaseCon<ImageConConfig> {
  static tagName = "img" as const;

  constructor(config?: Partial<Omit<ImageConConfig, "tagName">>) {
    super({ ...config, tagName: ImageCon.tagName });

    const { src, alt, uniappConfig } = config ?? {};
    this.config.src = src ?? "";
    this.config.alt = alt ?? "";
    this.config.uniappConfig = uniappConfig ?? {
      mode: UniappImageModeType.ScaleToFill
    };
  }

  protected getHtml(): VNode {
    return (
      <img
        class={this.classNames.join(" ")}
        style={this.lineStyle}
        src={this.config.src}
        alt={this.config.alt}
        data-key={this.key}
      />
    );
  }

  protected getEditor(options?: RenderEditorOptions) {
    const { imageAssets } = options ?? {};
    const editor = super.getEditor(options);
    editor.push({
      type: ImageEditorType.image,
      component: <ImageEditor con={this} imageAssets={imageAssets || []} />
    });
    return editor;
  }

  protected getCode_(options?: GetCodeOptions): GetCodeReturn {
    const style = this.style;
    const class_ = this.classNames.join(" ");

    const variableName = kebabToCamelCase(toValidVariableName(this.config.name), true);

    let html = `<img class="${class_}" src="${this.config.src}" alt="${this.config.alt}" />`;
    let css = `
    ${style.selector}{
      ${style.value}
    }
    `;
    let js = "";

    return {
      html,
      css,
      js
    };
  }
}
