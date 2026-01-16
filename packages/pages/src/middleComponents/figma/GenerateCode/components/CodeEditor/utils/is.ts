import { BaseCon, DivCon, ImageCon, TextCon } from "../controller";

export function isDivCon(con: BaseCon): con is DivCon {
  return con instanceof DivCon;
}

export function isImageCon(con: BaseCon): con is ImageCon {
  return con instanceof ImageCon;
}

export function isTextCon(con: BaseCon): con is TextCon {
  return con instanceof TextCon;
}
