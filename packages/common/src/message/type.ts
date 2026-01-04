export interface MessageReq<T = any> {
  type: string;
  value?: T;
}

export interface MessageRes<T = any> {
  succeed: boolean;
  data?: T;
  msg?: string;
}
