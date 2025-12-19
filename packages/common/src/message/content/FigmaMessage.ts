import { BaseMessage } from "../BaseMessage";

class FigmaAssetsMessage extends BaseMessage<
  void,
  {
    codes: any[];
    assets: any[];
  }
> {
  constructor() {
    super("figma-assets");
  }
}

export const figmaAssetsMessage = new FigmaAssetsMessage();
