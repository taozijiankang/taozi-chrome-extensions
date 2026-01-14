import type { BaseCon, BaseConConfig, TextTagName } from "../controller";
import { DivCon, DivTagName, ImageCon, ImageTagName, TextCon, textTagNameList } from "../controller";

export interface ExportConfig {
  config: BaseConConfig;
  children: ExportConfig[];
}

export function exportConfigs(cons: BaseCon[]): ExportConfig[] {
  return cons.map(con => {
    return {
      config: JSON.parse(JSON.stringify(con.config)),
      children: exportConfigs(con.children)
    };
  });
}

export function importConfigs(configs: ExportConfig[]): BaseCon[] {
  return configs
    .map(config => {
      let con: BaseCon | undefined;
      if (config.config.tagName === DivTagName.div) {
        con = new DivCon(config.config);
      } else if (config.config.tagName === ImageTagName.img) {
        con = new ImageCon(config.config);
      } else if (textTagNameList.includes(config.config.tagName as TextTagName)) {
        con = new TextCon(config.config.tagName as TextTagName, config.config);
      } else {
        console.warn(`Unsupported tag name: ${config.config.tagName}`);
        return undefined;
      }
      con.children = importConfigs(config.children);
      return con!;
    })
    .filter(Boolean) as BaseCon[];
}

export function cloneCons(cons: BaseCon[]): BaseCon[] {
  const cs = exportConfigs(cons);
  // 清除配置中的id属性
  const f = (cs: ExportConfig[]) => {
    cs.forEach(c => {
      c.config.id = "";
      f(c.children || []);
    });
  };
  f(cs);
  return importConfigs(cs);
}
