import { useLocalStorage } from "../useLocalStorage";
import type { OpenAi } from "../../type/modules/openAi";

/**
 * 聊天消息
 */
export interface ChatMessage extends OpenAi.Api.OpenAIMessage {
  /** 消息时间戳 */
  timestamp: number;
}

/**
 * 聊天框
 */
export interface ChatBox {
  /** 聊天框 ID */
  id: string;
  /** 聊天框标题 */
  title: string;
  /** 聊天记录列表 */
  messages: ChatMessage[];
  /** 创建时间戳 */
  createdAt: number;
  /** 更新时间戳 */
  updatedAt: number;
}

/**
 * Agent 本地存储
 */
export interface AgentLocalStorage {
  /** 聊天框列表 */
  chatBoxes?: ChatBox[];
  /** 当前激活的聊天框 ID */
  activeChatBoxId?: string;
  /** 每个聊天框的输入内容，key 为聊天框 ID */
  chatBoxInputs?: Record<string, string>;
}

export const agentLocalStorage = useLocalStorage<string, AgentLocalStorage>("agent-local-storage", {
  chatBoxes: [],
  activeChatBoxId: undefined
});
