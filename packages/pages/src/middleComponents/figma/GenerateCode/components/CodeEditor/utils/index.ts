import { BaseCon } from "../controller";
import { v4 as uuidv4 } from "uuid";
export * from "./is";
export * from "./transition";

export function getKey(): string {
  return uuidv4();
}

export function forEachCon(cons: BaseCon[], callback: (con: BaseCon) => void) {
  for (const con of cons) {
    callback(con);
    forEachCon(con.children, callback);
  }
}

export function findConByKey(cons: BaseCon[], key: string): BaseCon | undefined {
  for (const con of cons) {
    if (con.key === key) {
      return con;
    }
    const found = findConByKey(con.children, key);
    if (found) {
      return found;
    }
  }
  return undefined;
}

export function findConById(cons: BaseCon[], id: string): BaseCon | undefined {
  for (const con of cons) {
    if (con.config.id === id) {
      return con;
    }
    const found = findConById(con.children, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

export function filterCons(cons: BaseCon[], filter: (con: BaseCon) => boolean): BaseCon[] {
  const result: BaseCon[] = [];
  for (const con of cons) {
    if (filter(con)) {
      result.push(con);
    }
    result.push(...filterCons(con.children, filter));
  }
  return result;
}
