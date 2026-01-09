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

export function forEachCon(cons: BaseCon[], callback: (con: BaseCon) => void) {
  for (const con of cons) {
    callback(con);
    forEachCon(con.children ?? [], callback);
  }
}

export function findConByKey(cons: BaseCon[], key: string): BaseCon | undefined {
  for (const con of cons) {
    if (con.key === key) {
      return con;
    }
    const found = findConByKey(con.children ?? [], key);
    if (found) {
      return found;
    }
  }
  return undefined;
}
