import { useLocalStorage } from "../useLocalStorage";

/**
 * 聊天消息
 */
export interface ChatMessage {
  /** 消息角色 */
  role: "user" | "assistant";
  /** 消息内容 */
  content: string;
  /** 消息时间戳 */
  timestamp: number;
}

/**
 * AI 助手本地存储
 */
export interface AIAssistantLocalStorage {
  /** 聊天记录列表 */
  chatMessages?: ChatMessage[];
}

export const aiAssistantLocalStorage = useLocalStorage<string, AIAssistantLocalStorage>("ai-assistant-local-storage", {
  chatMessages: []
});
