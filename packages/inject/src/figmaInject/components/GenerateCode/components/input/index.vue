<template>
  <div class="input-container">
    <span class="value">{{ input || "--" }}</span>
    <ElButton @click="handlePasteComponentName" :loading="pasteComponentNameLoading">粘贴</ElButton>
    <ElButton @click="handleTranslateComponentName" :loading="translateComponentNameLoading">翻译</ElButton>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElMessage } from "element-plus";
import { ref } from "vue";
import { sendMessage } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";

const input = defineModel<string>("value");

const pasteComponentNameLoading = ref(false);
const handlePasteComponentName = async () => {
  try {
    pasteComponentNameLoading.value = true;
    const text = await navigator.clipboard.readText();
    input.value = text;
  } finally {
    pasteComponentNameLoading.value = false;
  }
};

const translateComponentNameLoading = ref(false);
const handleTranslateComponentName = async () => {
  translateComponentNameLoading.value = true;
  try {
    const res = await sendMessage<string>({
      type: MessageType.BaiduTranslate,
      value: input.value,
    });
    if (res) {
      input.value = toValidVariableName(res);
    }
  } catch (error) {
    console.error("翻译组件名称失败", error);
    ElMessage({
      message: String(error),
      type: "error",
    });
  } finally {
    translateComponentNameLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
