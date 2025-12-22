import { BaseMessage } from "../BaseMessage";

class FigmaAssetsMessage extends BaseMessage<
  void,
  {
    fileKey: string;
    nodeId: string;
    codes: any[];
  }
> {
  constructor() {
    super("figma-assets");
  }
}

export const figmaAssetsMessage = new FigmaAssetsMessage();
