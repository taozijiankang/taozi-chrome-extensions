import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type RenderEditorOptions } from "./_BaseCon";
import ImageEditor from "../components/ImageEditor/index.vue";
import { UniappImageModeType } from "../constants/enum";

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
}
