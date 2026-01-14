<template>
  <div class="agent">
    <!-- 聊天消息列表 -->
    <div class="chat-messages" ref="messagesContainerRef">
      <div v-if="chatMessages.length === 0" class="empty-state">
        <p>开始与 Agent 对话吧～</p>
      </div>
      <div v-for="(message, index) in chatMessages" :key="index" class="message-item" :class="message.role">
        <div class="message-avatar">
          <span v-if="message.role === 'user'">👤</span>
          <span v-else>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-text">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      <!-- 加载中状态 -->
      <div v-if="loading" class="message-item assistant">
        <div class="message-avatar">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-text loading">
            <span>正在思考</span>
            <span class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-container">
      <ElInput
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        @keydown.ctrl.enter="handleSend"
        @keydown.meta.enter="handleSend"
        :disabled="loading"
      />
      <div class="input-actions">
        <ElButton type="text" size="small" @click="handleClear" :disabled="loading || chatMessages.length === 0">
          清空聊天
        </ElButton>
        <ElButton type="primary" @click="handleSend" :loading="loading" :disabled="!inputMessage.trim()"> 发送 </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { ElInput, ElButton, ElMessage } from "element-plus";
import { agentLocalStorage, type ChatMessage } from "@taozi-chrome-extensions/common/src/local";
import { requestOpenAIChatCompletionMessage } from "@taozi-chrome-extensions/common/src/message";
import type { OpenAi } from "@taozi-chrome-extensions/common/src/type/modules/openAi";

// 状态
const inputMessage = ref("");
const loading = ref(false);
const chatMessages = ref<ChatMessage[]>([]);
const messagesContainerRef = ref<HTMLElement | null>(null);

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
  }
};

// 加载聊天记录
const loadChatMessages = async () => {
  const data = await agentLocalStorage.get();
  chatMessages.value = data?.chatMessages || [];
  await scrollToBottom();
};

// 保存聊天记录
const saveChatMessages = () => {
  agentLocalStorage.edit(v => {
    v.chatMessages = JSON.parse(JSON.stringify(chatMessages.value));
  });
};

// 添加消息
const addMessage = (role: "user" | "assistant", content: string) => {
  const message: ChatMessage = {
    role,
    content,
    timestamp: Date.now()
  };
  chatMessages.value.push(message);
  saveChatMessages();
  scrollToBottom();
};

// 发送消息
const handleSend = async () => {
  const message = inputMessage.value.trim();
  if (!message || loading.value) return;

  // 添加用户消息
  addMessage("user", message);
  inputMessage.value = "";

  // 构建消息列表用于 API 调用
  const apiMessages: OpenAi.Api.OpenAIMessage[] = chatMessages.value.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  loading.value = true;
  try {
    const response = await requestOpenAIChatCompletionMessage.sendMessage({
      messages: apiMessages,
      model: "gpt-3.5-turbo",
      temperature: 0.7
    });

    if (response.succeed && response.data) {
      const assistantMessage = response.data.choices[0]?.message?.content || "抱歉，我没有理解您的问题。";
      addMessage("assistant", assistantMessage);
    } else {
      throw new Error(response.msg || "请求失败");
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "发送消息失败，请检查配置";
    ElMessage.error(errorMessage);
    // 添加错误提示消息
    addMessage("assistant", `❌ 错误：${errorMessage}`);
  } finally {
    loading.value = false;
  }
};

// 清空聊天
const handleClear = () => {
  chatMessages.value = [];
  saveChatMessages();
};

// 监听消息变化，自动滚动
watch(
  chatMessages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

onMounted(() => {
  loadChatMessages();
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
