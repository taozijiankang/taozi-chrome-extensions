import type { MessageReq, MessageRes } from "./type";

export class BaseMessage<Req, Res> {
  constructor(public type: string) {}

  private async handleSendMessage(req: MessageReq<Req>, options?: { tabId?: number }): Promise<MessageRes<Res>> {
    const res = options?.tabId
      ? ((await chrome.tabs.sendMessage(options.tabId, req)) as MessageRes<Res>)
      : ((await chrome.runtime.sendMessage(req)) as MessageRes<Res>);
    if (!res) {
      return {
        succeed: false,
        msg: "res not found"
      };
    }
    return res;
  }

  sendMessage(data: Req) {
    return this.handleSendMessage({
      type: this.type,
      value: data
    });
  }

  sendTabMessage(tabId: number, data: Req) {
    return this.handleSendMessage(
      {
        type: this.type,
        value: data
      },
      { tabId }
    );
  }

  addListener(getResponse: (data: Req) => Promise<MessageRes<Res>>) {
    return chrome.runtime.onMessage.addListener((req: MessageReq<Req>, sender, sendResponse_: any) => {
      const sendResponse = (res: MessageRes<Res>) => {
        sendResponse_(res);
      };
      if (req.type === this.type) {
        getResponse(req.value as Req)
          .then(res => {
            sendResponse(res);
          })
          .catch(err => {
            sendResponse({
              succeed: false,
              msg: err.toString()
            });
          });
        return true;
      }
      return false;
    });
  }
}
