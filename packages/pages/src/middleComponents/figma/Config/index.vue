<template>
  <div class="figma-config">
    <ElAlert title="figmaApiKey是figma的api密钥，用于获取figma的资产" type="info" :closable="false" />
    <a target="_blank" href="https://www.figma.com/developers/api">figma api密钥申请</a>
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="figmaApiKey">
        <ElInput type="text" v-model="figmaApiKeyInput" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem, ElAlert } from "element-plus";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local";

const figmaApiKeyInput = ref("");

watch([figmaApiKeyInput], () => {
  figmaLocalStorage.edit(v => {
    v.figmaApiKey = figmaApiKeyInput.value;
  });
});

onMounted(async () => {
  const { figmaApiKey = "" } = (await figmaLocalStorage.get()) || {};
  figmaApiKeyInput.value = figmaApiKey;
});
</script>
<style lang="scss" scoped>
@use "./index";
</style>
