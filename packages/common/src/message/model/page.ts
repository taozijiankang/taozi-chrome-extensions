import { Page } from "../../constant/page";
import { useMessage } from "../useMessage";

export interface OpenPageMessageReq {
  page: Page;
}

export const openPageMessage = useMessage<OpenPageMessageReq, void>("open-page-message");
