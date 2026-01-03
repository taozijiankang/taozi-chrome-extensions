<template>
  <div class="dialog-content">
    <ElButton type="primary" @click="getFigmaAssets" :loading="getFigmaAssetsLoading">获取figma资源</ElButton>
    <ElAlert v-if="getFigmaAssetsErrorAlert" :closable="false" :title="getFigmaAssetsErrorAlert" type="error" />
    <ElSkeleton v-else-if="getFigmaAssetsLoading" :rows="4" animated />
    <template v-else> </template>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElAlert, ElSkeleton } from "element-plus";
import { onMounted, ref } from "vue";
import { figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message";

const getFigmaAssetsErrorAlert = ref("");

const getFigmaAssetsLoading = ref(false);
const getFigmaAssets = async () => {
  getFigmaAssetsErrorAlert.value = "";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  // 检查是否在 Figma 页面
  if (!tab.url || !tab.url.includes("figma.com")) {
    getFigmaAssetsErrorAlert.value = "请先打开 Figma 设计页面";
    return;
  }

  try {
    getFigmaAssetsLoading.value = true;

    const res = await figmaAssetsMessage.sendTabMessage(tab.id || 0);
    if (!res.succeed) {
      getFigmaAssetsErrorAlert.value = res.msg || "获取figma资源失败";
      return;
    }
    const { fileKey, nodeId, codes: codesData } = res.data || { codes: [] };
    if (!fileKey || !nodeId) {
      getFigmaAssetsErrorAlert.value = "获取figma资源失败，fileKey或nodeId为空";
      return;
    }
    console.log("获取figma资源成功", res.data);
  } catch (error) {
    getFigmaAssetsErrorAlert.value = "获取figma资源失败";
    console.error("获取figma资源失败", error);
  } finally {
    getFigmaAssetsLoading.value = false;
  }
};

onMounted(async () => {
  getFigmaAssets();
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
