import { MessageReq, MessageRes } from "./type";

export function useMessage<Req, Res>(type: string) {
  type originListener = (
    req: Req | undefined,
    sender: any
  ) => {
    result: boolean;
    getResponse?: () => MessageRes<Res> | Promise<MessageRes<Res>>;
  } | void;
  type virtualListener = (req: MessageReq<Req>, sender: any, sendResponse_: (res: MessageRes<Res>) => void) => boolean;

  const listenerMap: {
    origin: originListener;
    virtual: virtualListener;
  }[] = [];

  async function handleSendMessage(req: MessageReq<Req>, options?: { tabId?: number }): Promise<MessageRes<Res>> {
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

  function sendMessage(data: Req) {
    return handleSendMessage({
      type,
      value: data
    });
  }

  function sendTabMessage(tabId: number, data: Req) {
    return handleSendMessage(
      {
        type,
        value: data
      },
      { tabId }
    );
  }

  function addListener(originListener: originListener) {
    const virtualListener: virtualListener = (req, sender, sendResponse_) => {
      if (req.type === type) {
        const { result = false, getResponse } = originListener(req.value, sender) || {};
        if (getResponse) {
          Promise.resolve(getResponse()).then(sendResponse_);
        }
        return result;
      }
      return false;
    };
    listenerMap.push({
      origin: originListener,
      virtual: virtualListener
    });
    chrome.runtime.onMessage.addListener(virtualListener);
  }

  function removeListener(originListener: originListener) {
    const virtualListener = listenerMap.find(listener => listener.origin === originListener);
    if (virtualListener) {
      chrome.runtime.onMessage.removeListener(virtualListener.virtual);
    }
  }

  return {
    sendMessage,
    sendTabMessage,
    addListener,
    removeListener
  };
}
