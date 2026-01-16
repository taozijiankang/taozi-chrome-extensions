<template>
  <div class="agent">
    <!-- 聊天框标签页 -->
    <div class="chat-tabs-container">
      <div class="chat-tabs">
        <div
          v-for="chatBox in chatBoxes"
          :key="chatBox.id"
          class="chat-tab"
          :class="{ active: activeChatBoxId === chatBox.id }"
          @click="handleSwitchChatBox(chatBox.id)"
        >
          <span class="chat-tab-title">{{ chatBox.title }}</span>
          <ElIcon class="chat-tab-close" @click.stop="handleDeleteChatBox(chatBox.id)" v-if="chatBoxes.length > 1">
            <Close />
          </ElIcon>
        </div>
        <div class="chat-tab-add" @click="handleCreateChatBox">
          <ElIcon><Plus /></ElIcon>
        </div>
      </div>
    </div>

    <!-- 聊天消息列表 -->
    <div class="chat-messages" ref="messagesContainerRef">
      <div v-if="currentChatMessages.length === 0" class="empty-state">
        <p>开始与 Agent 对话吧～</p>
      </div>
      <div v-for="(message, index) in currentChatMessages" :key="index" class="message-item" :class="message.role">
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
        :disabled="loading || !activeChatBoxId"
      />
      <div class="input-actions">
        <ElButton type="text" size="small" @click="handleClear" :disabled="loading || currentChatMessages.length === 0">
          清空聊天
        </ElButton>
        <ElButton type="primary" @click="handleSend" :loading="loading" :disabled="!inputMessage.trim() || !activeChatBoxId">
          发送
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from "vue";
import { ElInput, ElButton, ElMessage, ElIcon } from "element-plus";
import { Plus, Close } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { agentLocalStorage, type ChatMessage, type ChatBox } from "@taozi-chrome-extensions/common/src/local";
import { requestOpenAIChatCompletionMessage } from "@taozi-chrome-extensions/common/src/message";
import type { OpenAi } from "@taozi-chrome-extensions/common/src/type/modules/openAi";

// 状态
const inputMessage = ref("");
const loading = ref(false);
const chatBoxes = ref<ChatBox[]>([]);
const activeChatBoxId = ref<string | undefined>(undefined);
const messagesContainerRef = ref<HTMLElement | null>(null);

// 当前激活的聊天框的消息列表（过滤掉系统消息，用于展示）
const currentChatMessages = computed(() => {
  if (!activeChatBoxId.value) return [];
  const chatBox = chatBoxes.value.find(box => box.id === activeChatBoxId.value);
  if (!chatBox) return [];
  // 过滤掉系统消息，只显示用户和助手消息
  return chatBox.messages.filter(msg => msg.role !== "system");
});

// 生成聊天框标题（基于第一条用户消息）
const generateChatBoxTitle = (messages: ChatMessage[]): string => {
  const firstUserMessage = messages.find(msg => msg.role === "user");
  if (firstUserMessage) {
    const content = firstUserMessage.content.trim();
    // 取前20个字符作为标题
    return content.length > 20 ? content.substring(0, 20) + "..." : content;
  }
  return "新对话";
};

// 创建新的聊天框 ID
const generateChatBoxId = (): string => {
  return `chatbox-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// 格式化时间（用于消息显示）
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 格式化完整时间（用于系统提示词）
const formatFullTime = (): string => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainerRef.value) {
    messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
  }
};

// 加载聊天框数据
const loadChatBoxes = async () => {
  const data = await agentLocalStorage.get();

  chatBoxes.value = data?.chatBoxes || [];
  activeChatBoxId.value = data?.activeChatBoxId;

  // 如果没有聊天框，创建一个默认的
  if (chatBoxes.value.length === 0) {
    await handleCreateChatBox();
  } else if (!activeChatBoxId.value || !chatBoxes.value.find(box => box.id === activeChatBoxId.value)) {
    // 如果当前激活的聊天框不存在，选择第一个
    activeChatBoxId.value = chatBoxes.value[0].id;
    await saveChatBoxes();
  }

  // 加载当前聊天框的输入内容
  await loadInputMessage();
  await scrollToBottom();
};

// 保存聊天框数据
const saveChatBoxes = async () => {
  await agentLocalStorage.edit(v => {
    v.chatBoxes = JSON.parse(JSON.stringify(chatBoxes.value));
    v.activeChatBoxId = activeChatBoxId.value;
  });
};

// 保存当前聊天框的输入内容
const saveInputMessage = async () => {
  if (!activeChatBoxId.value) return;
  await agentLocalStorage.edit(v => {
    if (!v.chatBoxInputs) {
      v.chatBoxInputs = {};
    }
    v.chatBoxInputs[activeChatBoxId.value!] = inputMessage.value;
  });
};

// 加载当前聊天框的输入内容
const loadInputMessage = async () => {
  if (!activeChatBoxId.value) {
    inputMessage.value = "";
    return;
  }
  const data = await agentLocalStorage.get();
  inputMessage.value = data?.chatBoxInputs?.[activeChatBoxId.value] || "";
};

// 创建新聊天框
const handleCreateChatBox = async () => {
  // 保存当前聊天框的输入内容
  await saveInputMessage();

  const newChatBox: ChatBox = {
    id: generateChatBoxId(),
    title: "新对话",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  chatBoxes.value.push(newChatBox);
  activeChatBoxId.value = newChatBox.id;
  await saveChatBoxes();
  inputMessage.value = "";
  await scrollToBottom();
};

// 切换聊天框
const handleSwitchChatBox = async (chatBoxId: string) => {
  if (activeChatBoxId.value === chatBoxId) return;

  // 保存当前聊天框的输入内容
  await saveInputMessage();

  activeChatBoxId.value = chatBoxId;
  await saveChatBoxes();

  // 加载新聊天框的输入内容
  await loadInputMessage();
  await scrollToBottom();
};

// 删除聊天框
const handleDeleteChatBox = async (chatBoxId: string) => {
  if (chatBoxes.value.length <= 1) {
    ElMessage.warning("至少需要保留一个聊天框");
    return;
  }

  const index = chatBoxes.value.findIndex(box => box.id === chatBoxId);
  if (index === -1) return;

  const isDeletingActive = activeChatBoxId.value === chatBoxId;

  chatBoxes.value.splice(index, 1);

  // 删除对应的输入内容
  await agentLocalStorage.edit(v => {
    if (v.chatBoxInputs) {
      delete v.chatBoxInputs[chatBoxId];
    }
  });

  // 如果删除的是当前激活的聊天框，切换到其他聊天框
  if (isDeletingActive) {
    // 优先选择同一位置的（删除后对应位置），如果没有则选择前面的
    if (index < chatBoxes.value.length) {
      activeChatBoxId.value = chatBoxes.value[index].id;
    } else if (chatBoxes.value.length > 0) {
      activeChatBoxId.value = chatBoxes.value[chatBoxes.value.length - 1].id;
    } else {
      activeChatBoxId.value = undefined;
    }
    // 加载新聊天框的输入内容
    await loadInputMessage();
  }

  await saveChatBoxes();
  await scrollToBottom();
};

// 添加消息
const addMessage = async (role: "user" | "assistant", content: string) => {
  if (!activeChatBoxId.value) return;

  const message: ChatMessage = {
    role,
    content,
    timestamp: Date.now()
  };

  const chatBox = chatBoxes.value.find(box => box.id === activeChatBoxId.value);
  if (!chatBox) return;

  chatBox.messages.push(message);
  chatBox.updatedAt = Date.now();

  // 如果是第一条用户消息，更新标题
  if (chatBox.title === "新对话" && role === "user") {
    chatBox.title = generateChatBoxTitle(chatBox.messages);
  }

  await saveChatBoxes();
  await scrollToBottom();
};

// 发送消息
const handleSend = async () => {
  const message = inputMessage.value.trim();
  if (!message || loading.value || !activeChatBoxId.value) return;

  const chatBox = chatBoxes.value.find(box => box.id === activeChatBoxId.value);
  if (!chatBox) return;

  // 先添加系统提示词（当前时间）
  const systemMessage: ChatMessage = {
    role: "system",
    content: `现在是 ${formatFullTime()}`,
    timestamp: Date.now()
  };
  chatBox.messages.push(systemMessage);
  chatBox.updatedAt = Date.now();

  // 添加用户消息
  await addMessage("user", message);
  inputMessage.value = "";
  // 清空输入并保存
  await saveInputMessage();

  // 构建消息列表用于 API 调用（包含系统消息）
  const apiMessages: OpenAi.Api.OpenAIMessage[] = chatBox.messages.map(msg => ({
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
      await addMessage("assistant", assistantMessage);
    } else {
      throw new Error(response.msg || "请求失败");
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "发送消息失败，请检查配置";
    ElMessage.error(errorMessage);
    // 添加错误提示消息
    await addMessage("assistant", `❌ 错误：${errorMessage}`);
  } finally {
    loading.value = false;
  }
};

// 清空聊天
const handleClear = async () => {
  if (!activeChatBoxId.value) return;

  const chatBox = chatBoxes.value.find(box => box.id === activeChatBoxId.value);
  if (!chatBox) return;

  chatBox.messages = [];
  chatBox.title = "新对话";
  chatBox.updatedAt = Date.now();
  await saveChatBoxes();
  await scrollToBottom();
};

// 监听消息变化，自动滚动
watch(
  currentChatMessages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// 监听聊天框切换，自动滚动并加载输入内容
watch(activeChatBoxId, async () => {
  await loadInputMessage();
  scrollToBottom();
});

// 监听输入内容变化，自动保存（使用防抖）
let saveInputTimer: ReturnType<typeof setTimeout> | null = null;
watch(inputMessage, () => {
  if (saveInputTimer) {
    clearTimeout(saveInputTimer);
  }
  saveInputTimer = setTimeout(() => {
    saveInputMessage();
  }, 300); // 300ms 防抖
});

onMounted(() => {
  loadChatBoxes();
});

onBeforeUnmount(() => {
  // 清理定时器
  if (saveInputTimer) {
    clearTimeout(saveInputTimer);
    saveInputTimer = null;
  }
  // 保存当前输入内容
  saveInputMessage();
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
