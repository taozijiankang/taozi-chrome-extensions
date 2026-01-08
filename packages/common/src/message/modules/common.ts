import { Page } from "../../constant/page";
import type { Github } from "../../type";
import { useMessage } from "../useMessage";

export interface OpenPageMessageReq {
  page: Page;
}

export const openPageMessage = useMessage<OpenPageMessageReq, void>("open-page-message");

export const requestReleaseVersionListMessage = useMessage<void, Github.Api.GetReleases.Res>(
  "request-release-version-list-message"
);
