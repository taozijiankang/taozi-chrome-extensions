/**
 * Anthropic 对话相关的通用类型
 * 仅包含调用 Messages API 所需的必要字段，刻意不依赖 `@anthropic-ai/sdk`，
 * 以便前端（pages）等不直接调用 SDK 的包也能安全引用，避免把 node 类型带入打包。
 */
export namespace AnthropicChat {
  /** 单条对话消息 */
  export interface Message {
    role: "user" | "assistant";
    content: string;
  }

  /** 调用 Messages API 的请求参数 */
  export interface Req {
    /** 模型（缺省时由后端使用配置中的默认模型） */
    model?: string;
    /** 最大生成 token 数（缺省时由后端使用默认值） */
    max_tokens?: number;
    /** 系统提示词 */
    system?: string;
    /** 对话消息列表 */
    messages: Message[];
    /** 采样温度 */
    temperature?: number;
  }

  /** 响应中的内容块（仅保留我们使用到的字段） */
  export interface ContentBlock {
    type: string;
    text?: string;
  }

  /** Messages API 的响应（仅保留我们使用到的字段） */
  export interface Res {
    content: ContentBlock[];
  }
}
