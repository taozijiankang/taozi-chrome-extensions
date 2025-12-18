export interface BaseCode {
  title: string;
  lang: string;
  content: string;
}

export interface Asset {
  type: "icon" | "image";
  src: string;
  name: string;
  width: number;
  height: number;
}
