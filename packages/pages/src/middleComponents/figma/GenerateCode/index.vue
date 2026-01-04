<template>
  <div class="figma-generate-code">
    {{ figmaAssetsReq }}
  </div>
</template>

<script setup lang="ts">
import { figmaAssetsMessage, type FigmaAssetsReq } from "@taozi-chrome-extensions/common/src/message";
import { onMounted, onUnmounted, ref } from "vue";

const figmaAssetsReq = ref<FigmaAssetsReq>();

const figmaAssetsListener: Parameters<typeof figmaAssetsMessage.addListener>[0] = req => {
  if (req) {
    figmaAssetsReq.value = req;
  }
  return {
    result: false
  };
};

onMounted(async () => {
  figmaAssetsMessage.addListener(figmaAssetsListener);
});

onUnmounted(() => {
  figmaAssetsMessage.removeListener(figmaAssetsListener);
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
