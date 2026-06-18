<template>
  <div class="anthropic-config">
    <div class="config-switcher">
      <ElRadioGroup v-if="configs.length" v-model="activeId" class="config-radios">
        <ElRadio v-for="item in configs" :key="item.id" :value="item.id">{{ item.name || "未命名配置" }}</ElRadio>
      </ElRadioGroup>
      <ElButton @click="handleAdd">新增</ElButton>
    </div>

    <ElForm v-if="activeConfig" label-width="auto" label-suffix=":">
      <ElFormItem label="名称">
        <ElInput v-model="nameInput" placeholder="给这份配置起个名字，便于区分" />
      </ElFormItem>

      <ElFormItem label="Base URL">
        <ElInput type="text" v-model="baseUrlInput" placeholder="https://api.anthropic.com" />
      </ElFormItem>

      <ElFormItem label="鉴权方式">
        <div class="auth-field">
          <ElRadioGroup v-model="authType">
            <ElRadio value="apiKey">API Key</ElRadio>
            <ElRadio value="authToken">Auth Token</ElRadio>
          </ElRadioGroup>
          <div class="auth-tip">{{ authTip }}</div>
          <div v-if="inactiveTip" class="auth-tip auth-tip--warning">{{ inactiveTip }}</div>
          <ElInput v-if="authType === 'apiKey'" type="text" v-model="apiKeyInput" placeholder="sk-ant-..." />
          <ElInput v-else type="text" v-model="authTokenInput" placeholder="Authorization: Bearer 使用的 token" />
        </div>
      </ElFormItem>

      <ElFormItem label="模型">
        <ElInput type="text" v-model="modelInput" placeholder="claude-sonnet-4-6" />
      </ElFormItem>

      <div class="delete-row">
        <ElButton type="danger" plain @click="handleDelete">删除此配置</ElButton>
      </div>
    </ElForm>
    <div v-else class="empty-tip">还没有配置，点击「新增」创建一个。</div>

    <template v-if="activeConfig">
      <ElDivider />

      <div class="test-section">
        <div class="test-section__title">连接测试</div>
        <div class="test-field">
          <ElInput
            type="textarea"
            v-model="testInput"
            :rows="3"
            placeholder="输入要发送给模型的内容，例如：你好，请用一句话介绍你自己"
          />
          <ElButton type="primary" :loading="testing" :disabled="!testInput.trim()" @click="handleTest">
            {{ testing ? "请求中..." : "发送" }}
          </ElButton>
          <div v-if="testOutput" class="test-output" :class="{ 'test-output--error': testError }">
            {{ testOutput }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ElInput, ElForm, ElFormItem, ElRadioGroup, ElRadio, ElButton, ElDivider, ElMessage, ElMessageBox } from "element-plus";
import { configLocalStorage, type AnthropicConfigItem } from "@taozi-chrome-extensions/common/src/local";
import { requestAnthropicChatMessage } from "@taozi-chrome-extensions/common/src/message";
import { ref, watch, computed, nextTick, onMounted } from "vue";

type AuthType = "apiKey" | "authToken";

const configs = ref<AnthropicConfigItem[]>([]);
const activeId = ref("");

// 当前激活配置的编辑表单（与激活项双向同步）
const nameInput = ref("");
const baseUrlInput = ref("");
const authType = ref<AuthType>("apiKey");
const apiKeyInput = ref("");
const authTokenInput = ref("");
const modelInput = ref("");

const testing = ref(false);
const testInput = ref("你好，请用一句话介绍你自己");
const testOutput = ref("");
const testError = ref(false);

const activeConfig = computed(() => configs.value.find(item => item.id === activeId.value));

const authTip = computed(() =>
  authType.value === "apiKey"
    ? "走 x-api-key 请求头，为官方鉴权方式。"
    : "走 Authorization: Bearer 请求头，常用于代理 / 第三方端点。"
);

// 未启用的那种方式若已存有值，提醒用户它当前不生效
const inactiveTip = computed(() => {
  if (authType.value === "apiKey" && authTokenInput.value.trim()) {
    return "已保存 Auth Token，但当前未启用（仅使用 API Key）。";
  }
  if (authType.value === "authToken" && apiKeyInput.value.trim()) {
    return "已保存 API Key，但当前未启用（仅使用 Auth Token）。";
  }
  return "";
});

const createConfigItem = (): AnthropicConfigItem => ({
  id: crypto.randomUUID(),
  name: `配置 ${configs.value.length + 1}`,
  authType: "apiKey",
  apiKey: "",
  authToken: "",
  baseUrl: "https://api.anthropic.com",
  model: "claude-sonnet-4-6"
});

// 程序化回填表单时为 true，避免触发写回
let syncing = false;
// 挂载初始化完成后才启用 watch，避免回填触发持久化
let loaded = false;

const persist = () => {
  return configLocalStorage.edit(v => {
    // chrome.storage 无法克隆 Vue 响应式 Proxy，需转为纯对象再存
    v.anthropicConfigs = JSON.parse(JSON.stringify(configs.value)) as AnthropicConfigItem[];
    v.anthropicActiveConfigId = activeId.value;
  });
};

// 把激活项的字段回填到编辑表单
const loadForm = () => {
  syncing = true;
  const item = activeConfig.value;
  nameInput.value = item?.name ?? "";
  baseUrlInput.value = item?.baseUrl ?? "";
  authType.value = item?.authType ?? "apiKey";
  apiKeyInput.value = item?.apiKey ?? "";
  authTokenInput.value = item?.authToken ?? "";
  modelInput.value = item?.model ?? "";
  nextTick(() => {
    syncing = false;
  });
};

// 把编辑表单写回激活项并持久化
const writeBack = () => {
  const item = activeConfig.value;
  if (!item) return;
  item.name = nameInput.value;
  item.baseUrl = baseUrlInput.value;
  item.authType = authType.value;
  item.apiKey = apiKeyInput.value;
  item.authToken = authTokenInput.value;
  item.model = modelInput.value;
  persist();
};

const handleAdd = () => {
  const item = createConfigItem();
  configs.value.push(item);
  activeId.value = item.id;
};

const handleDelete = async () => {
  const item = activeConfig.value;
  if (!item) return;

  try {
    await ElMessageBox.confirm(`确定删除配置「${item.name || "未命名配置"}」吗？此操作不可恢复。`, "删除确认", {
      type: "warning",
      confirmButtonText: "删除",
      cancelButtonText: "取消"
    });
  } catch {
    // 用户取消
    return;
  }

  const idx = configs.value.findIndex(c => c.id === activeId.value);
  if (idx === -1) return;
  configs.value.splice(idx, 1);
  activeId.value = configs.value[0]?.id ?? "";
};

const handleTest = async () => {
  const content = testInput.value.trim();
  if (!content) {
    return;
  }

  testing.value = true;
  testError.value = false;
  testOutput.value = "";
  try {
    // 先确保最新配置已落盘，background 调用时读取的才是当前填写的值
    await persist();

    const res = await requestAnthropicChatMessage.sendMessage({
      model: "",
      messages: [{ role: "user", content }]
    });

    if (!res.succeed || !res.data) {
      throw new Error(res.msg || "未知错误");
    }

    const reply = res.data.content
      .filter(block => block.type === "text")
      .map(block => block.text ?? "")
      .join("")
      .trim();

    testOutput.value = reply || "（模型未返回文本内容）";
  } catch (error) {
    testError.value = true;
    testOutput.value = `请求失败：${(error as Error).message}`;
    ElMessage({
      message: "测试请求失败",
      type: "error"
    });
  } finally {
    testing.value = false;
  }
};

// 编辑表单变化 → 写回激活项
watch([nameInput, baseUrlInput, authType, apiKeyInput, authTokenInput, modelInput], () => {
  if (!loaded || syncing) return;
  writeBack();
});

// 切换激活配置 → 持久化并回填表单
watch(activeId, () => {
  if (!loaded || syncing) return;
  persist();
  loadForm();
});

onMounted(async () => {
  const stored = (await configLocalStorage.get()) || {};
  const list = stored.anthropicConfigs ? [...stored.anthropicConfigs] : [];

  configs.value = list;
  activeId.value =
    stored.anthropicActiveConfigId && list.some(item => item.id === stored.anthropicActiveConfigId)
      ? stored.anthropicActiveConfigId
      : (list[0]?.id ?? "");

  loadForm();
  loaded = true;
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
