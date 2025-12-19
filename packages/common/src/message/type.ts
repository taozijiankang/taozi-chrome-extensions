export interface MessageReq<T = any> {
  type: string;
  value?: T;
}

export interface MessageRes<T = any> {
  succeed: boolean;
  msg?: string;
  data?: T;
}
