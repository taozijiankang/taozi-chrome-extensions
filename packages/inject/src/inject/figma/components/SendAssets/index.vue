<template>
  <div class="send-assets">
    <div class="control">
      <ElButton @click="openFigmaControlPage">打开figma控制页面</ElButton>
      <ElButton type="primary" @click="sendAssets">发送资产</ElButton>
    </div>
    <div v-if="sendAssetsErrorAlert" class="alert">
      <ElAlert :title="sendAssetsErrorAlert" type="error" :closable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElAlert } from "element-plus";
import { getBaseCodes } from "../../elController";
import { figmaAssetsBackgroundForwardingMessage, openPageMessage } from "@taozi-chrome-extensions/common/src/message";
import { Page } from "@taozi-chrome-extensions/common/src/constant/page";
import { ref } from "vue";

const sendAssetsLoading = ref(false);
const sendAssetsErrorAlert = ref<string | null>(null);

const openFigmaControlPage = () => {
  openPageMessage.sendMessage({ page: Page.Figma });
};

const sendAssets = async () => {
  const url = new URL(window.location.href);
  const nodeId = url.searchParams.get("node-id");
  const fileKey = url.href.match(/www\.figma\.com\/design\/(.*?)\//)?.[1] || "";
  if (!nodeId || !fileKey) {
    sendAssetsErrorAlert.value = "获取figma资产任务消息失败，nodeId或fileKey为空";
    return;
  }

  try {
    sendAssetsLoading.value = true;

    const codes = await getBaseCodes();

    const res = await figmaAssetsBackgroundForwardingMessage.sendMessage({
      fileKey,
      nodeId,
      codes
    });

    if (!res.succeed) {
      sendAssetsErrorAlert.value = res.msg || "发送figma资产任务消息失败";
      return;
    }

    sendAssetsErrorAlert.value = null;
  } catch (error) {
    sendAssetsErrorAlert.value = (error as Error).message || "发送figma资产任务消息失败";
    console.error("发送figma资产任务消息失败", error);
  } finally {
    sendAssetsLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
