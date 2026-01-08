import { BaseCon } from "./_BaseCon";
import { DivCon } from "./DivCon";
import { ImageCon } from "./ImageCon";
import { SpanCon } from "./SpanCon";

export { BaseCon, DivCon, ImageCon, SpanCon };

export function isDivCon(con: BaseCon): con is DivCon {
  return con instanceof DivCon;
}

export function isImageCon(con: BaseCon): con is ImageCon {
  return con instanceof ImageCon;
}

export function isSpanCon(con: BaseCon): con is SpanCon {
  return con instanceof SpanCon;
}
