export namespace OpenAi {
  export namespace Api {
    /**
     * OpenAI 聊天消息角色
     */
    export type OpenAIMessageRole = "system" | "user" | "assistant";

    /**
     * OpenAI 聊天消息
     */
    export interface OpenAIMessage {
      role: OpenAIMessageRole;
      content: string;
    }

    /**
     * OpenAI Chat Completion 请求参数
     */
    export interface OpenAIChatCompletionRequest {
      /** 消息列表 */
      messages: OpenAIMessage[];
      /** 使用的模型，默认为 gpt-3.5-turbo */
      model?: string;
      /** 温度参数，0-2，默认为 1 */
      temperature?: number;
      /** 最大生成的 token 数，默认为不限制 */
      max_tokens?: number;
      /** top_p 参数，默认为 1 */
      top_p?: number;
      /** 频率惩罚，-2.0 到 2.0，默认为 0 */
      frequency_penalty?: number;
      /** 存在惩罚，-2.0 到 2.0，默认为 0 */
      presence_penalty?: number;
      /** 停止序列 */
      stop?: string | string[];
      /** 流式返回，默认为 false */
      stream?: boolean;
    }

    /**
     * OpenAI Chat Completion 响应
     */
    export interface OpenAIChatCompletionResponse {
      id: string;
      object: string;
      created: number;
      model: string;
      choices: Array<{
        index: number;
        message: OpenAIMessage;
        finish_reason: string | null;
      }>;
      usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    }

    /**
     * OpenAI API 错误响应
     */
    export interface OpenAIErrorResponse {
      error: {
        message: string;
        type: string;
        param: string | null;
        code: string | null;
      };
    }
  }
}
