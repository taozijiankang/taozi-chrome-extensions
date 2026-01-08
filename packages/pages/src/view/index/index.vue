<template>
  <div class="index">
    <Tabs v-model:value="activeTab" :list="tabs" class="tabs" />
    <div class="content-container">
      <!-- 代码格式化测试 -->
      <CodeFormatTest v-if="activeTab === TabType.CodeFormatTest" />
      <!-- figma资产测试 -->
      <FigmaTest v-if="activeTab === TabType.FigmaTest" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Tabs from "../../components/Tabs/index.vue";
import CodeFormatTest from "../../middleComponents/test/CodeFormat/index.vue";
import FigmaTest from "../../middleComponents/figma/Test/index.vue";
import type { TabItem } from "../../components/Tabs";

enum TabType {
  FigmaTest = "FigmaTest",
  CodeFormatTest = "CodeFormatTest"
}

const tabs = ref<TabItem[]>([
  { label: "FigmaTest", value: TabType.FigmaTest },
  { label: "CodeFormatTest", value: TabType.CodeFormatTest }
]);

const activeTab = ref(TabType.FigmaTest);
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
