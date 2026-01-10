import type { BaseCon, BaseConConfig } from "../controller";
import { DivCon, ImageCon, SpanCon } from "../controller";
import { getKey } from "./index";

export interface ExportConfig {
  config: BaseConConfig;
  children: ExportConfig[];
}

export function exportConfigs(cons: BaseCon[]): ExportConfig[] {
  return cons.map(con => {
    return {
      config: JSON.parse(JSON.stringify(con.config)),
      children: exportConfigs(con.children ?? [])
    };
  });
}

export function cloneConfigs(configs: ExportConfig[]): ExportConfig[] {
  return configs.map(config => {
    const c: BaseConConfig = JSON.parse(JSON.stringify(config.config));
    c.key = getKey();
    return {
      config: c,
      children: cloneConfigs(config.children)
    };
  });
}

export function importConfigs(configs: ExportConfig[]): BaseCon[] {
  return configs
    .map(config => {
      let con: BaseCon | undefined;
      if (config.config.tagName === DivCon.tagName) {
        con = new DivCon(config.config);
      } else if (config.config.tagName === ImageCon.tagName) {
        con = new ImageCon(config.config);
      } else if (config.config.tagName === SpanCon.tagName) {
        con = new SpanCon(config.config);
      } else {
        console.warn(`Unsupported tag name: ${config.config.tagName}`);
        return undefined;
      }
      con.children = importConfigs(config.children);
      return con!;
    })
    .filter(Boolean) as BaseCon[];
}
