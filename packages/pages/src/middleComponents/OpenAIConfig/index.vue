<template>
  <div class="openai-config">
    <ElForm label-width="auto" label-suffix=":">
      <ElFormItem label="OpenAI API Key">
        <ElInput type="text" v-model="openaiApiKeyInput" />
      </ElFormItem>
      <ElFormItem label="OpenAI API Base URL">
        <ElInput type="text" v-model="openaiBaseUrlInput" />
      </ElFormItem>
      <ElFormItem label="OpenAI API Version">
        <ElInput type="text" v-model="openaiApiVersionInput" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
<script setup lang="ts">
import { ElInput, ElForm, ElFormItem } from "element-plus";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local";
import { ref, watch, onMounted } from "vue";

const openaiApiKeyInput = ref("");
const openaiBaseUrlInput = ref("");
const openaiApiVersionInput = ref("");

watch([openaiApiKeyInput, openaiBaseUrlInput, openaiApiVersionInput], () => {
  configLocalStorage.edit(v => {
    v.openaiApiKey = openaiApiKeyInput.value;
    v.openaiBaseUrl = openaiBaseUrlInput.value;
    v.openaiApiVersion = openaiApiVersionInput.value;
  });
});

onMounted(async () => {
  const { openaiApiKey = "", openaiBaseUrl = "", openaiApiVersion = "" } = (await configLocalStorage.get()) || {};

  openaiApiKeyInput.value = openaiApiKey;
  openaiBaseUrlInput.value = openaiBaseUrl;
  openaiApiVersionInput.value = openaiApiVersion;
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
