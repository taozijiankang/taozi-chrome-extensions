import type { VNode } from "vue";
import { BaseCon, type BaseConProps, type RenderCodeProps } from "./_BaseCon";

export interface ImageConProps extends BaseConProps<"img"> {
  src: string;
  alt: string;
}

export class ImageCon extends BaseCon {
  static tagName = "img" as const;

  constructor(public readonly props: ImageConProps) {
    super(props);
  }

  renderHtml(): VNode {
    return <img class={this.className} style={this.lineStyle} src={this.props.src} alt={this.props.alt} />;
  }

  static getCon(props: Omit<ImageConProps, "tagName">): ImageCon {
    return new ImageCon({ ...props, tagName: ImageCon.tagName });
  }
}
