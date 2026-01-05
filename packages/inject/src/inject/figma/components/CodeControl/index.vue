<template>
  <div class="send-assets">
    <div class="control">
      <ElButton @click="openFigmaControlPage">打开figma控制台页面</ElButton>
      <ElButton type="primary" :loading="sendNodeInfoLoading" @click="sendNodeInfoToConsole">发送节点信息到figma控制台</ElButton>
    </div>
    <div v-if="sendNodeInfoErrorAlert" class="alert">
      <ElAlert :title="sendNodeInfoErrorAlert" type="error" :closable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElAlert } from "element-plus";
import { getBaseCodes } from "../../elController";
import { figmaAssetsBackgroundForwardingMessage, openPageMessage } from "@taozi-chrome-extensions/common/src/message";
import { Page } from "@taozi-chrome-extensions/common/src/constant/page";
import { ref } from "vue";

const sendNodeInfoLoading = ref(false);
const sendNodeInfoErrorAlert = ref<string | null>(null);

const openFigmaControlPage = () => {
  openPageMessage.sendMessage({ page: Page.Figma });
};

const sendNodeInfoToConsole = async () => {
  const url = new URL(window.location.href);
  const nodeId = url.searchParams.get("node-id");
  const fileKey = url.href.match(/www\.figma\.com\/design\/(.*?)\//)?.[1] || "";
  if (!nodeId || !fileKey) {
    sendNodeInfoErrorAlert.value = "发送到控制台失败，nodeId或fileKey为空";
    return;
  }

  try {
    sendNodeInfoLoading.value = true;

    const codes = await getBaseCodes();

    const res = await figmaAssetsBackgroundForwardingMessage.sendMessage({
      fileKey,
      nodeId,
      codes
    });

    if (!res.succeed) {
      sendNodeInfoErrorAlert.value = res.msg || "发送到控制台失败";
      return;
    }

    sendNodeInfoErrorAlert.value = null;
  } catch (error) {
    sendNodeInfoErrorAlert.value = (error as Error).message || "发送到控制台失败";
    console.error("发送到控制台失败", error);
  } finally {
    sendNodeInfoLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
