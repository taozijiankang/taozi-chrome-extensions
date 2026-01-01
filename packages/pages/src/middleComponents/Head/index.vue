<template>
  <div class="head">
    <img src="../../assets/icon-128.png" alt="" />
    <span>taozi科技</span>
    <el-button v-if="showHomeButton" type="primary" size="small" @click="handleOpenHome" class="home-button">
      打开主页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import { openHomePage } from "@taozi-chrome-extensions/common/src/utils/openHomePage";

defineProps<{
  showHomeButton?: boolean;
}>();

const handleOpenHome = async () => {
  await openHomePage();
  // 如果是popup，打开主页后可以关闭popup
  if (window.location.pathname.includes("popup.html")) {
    window.close();
  }
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
