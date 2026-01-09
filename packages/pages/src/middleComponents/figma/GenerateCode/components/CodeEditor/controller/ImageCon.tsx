import type { VNode } from "vue";
import { BaseCon, type BaseConConfig, type RenderEditorOptions } from "./_BaseCon";
import ImageEditor from "../components/ImageEditor/index.vue";

export interface ImageConConfig extends BaseConConfig<"img"> {
  src: string;
  alt: string;
}

export enum ImageEditorType {
  image = "image"
}

export class ImageCon extends BaseCon {
  static tagName = "img" as const;

  constructor(public readonly config: ImageConConfig) {
    super(config);
  }

  renderHtml(): VNode {
    if (this.disabled) {
      return <></>;
    }
    return <img class={this.className} style={this.lineStyle} src={this.config.src} alt={this.config.alt} data-key={this.key} />;
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

  static getCon(config: Omit<ImageConConfig, "tagName">): ImageCon {
    return new ImageCon({ ...config, tagName: ImageCon.tagName });
  }
}
