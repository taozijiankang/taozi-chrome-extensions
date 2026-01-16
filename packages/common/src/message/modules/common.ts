import { Page } from "../../constant/page";
import type { Github, OpenAi } from "../../type";
import { useMessage } from "../useMessage";

export interface OpenPageMessageReq {
  page: Page;
}

export const openPageMessage = useMessage<OpenPageMessageReq, void>("open-page-message");

export const requestReleaseVersionListMessage = useMessage<void, Github.Api.GetReleases.Res>(
  "request-release-version-list-message"
);

export const requestOpenAIChatCompletionMessage = useMessage<
  OpenAi.Api.OpenAIChatCompletionRequest,
  OpenAi.Api.OpenAIChatCompletionResponse
>("request-openai-chat-completion-message");
