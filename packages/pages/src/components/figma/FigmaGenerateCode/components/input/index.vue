<template>
  <div class="input-container">
    <ElInput v-model="input" @keydown.enter.prevent="handleTranslateComponentName">
      <template #append>
        <ElButton @click="handleTranslateComponentName" :loading="translateComponentNameLoading">翻译</ElButton>
      </template>
    </ElInput>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElInput, ElMessage } from "element-plus";
import { ref } from "vue";
import { toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { baiduTranslateMessage } from "@taozi-chrome-extensions/common/src/message";

const input = defineModel<string>("value");

const translateComponentNameLoading = ref(false);
const handleTranslateComponentName = async () => {
  translateComponentNameLoading.value = true;
  try {
    const res = await baiduTranslateMessage.sendMessage(input.value || "");
    if (res.succeed) {
      input.value = toValidVariableName(res.data || "");
    }
  } catch (error) {
    console.error("翻译组件名称失败", error);
    ElMessage({
      message: String(error),
      type: "error"
    });
  } finally {
    translateComponentNameLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
