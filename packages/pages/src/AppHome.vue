<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Head from "./middleComponents/Head/index.vue";
import Tabs from "./components/Tabs/index.vue";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";
import FigmaGenerateCode from "./middleComponents/figma/GenerateCode/index.vue";

enum TabType {
  Figma = "Figma"
}
const tabs = ref<
  {
    label: string;
    value: TabType;
  }[]
>([
  {
    label: "Figma",
    value: TabType.Figma
  }
]);
const activeTab = ref(TabType.Figma);

watch(activeTab, () => {
  configLocalStorage.edit(v => {
    v.homeActiveTab = activeTab.value;
  });
});

onMounted(async () => {
  const { homeActiveTab } = (await configLocalStorage.get()) || {};
  activeTab.value = tabs.value.find(item => item.value === homeActiveTab)?.value || TabType.Figma;
});
</script>

<template>
  <div class="home">
    <div class="head">
      <Head />
    </div>
    <Tabs v-model:value="activeTab" :list="tabs" class="tabs" />
    <div class="content-container">
      <template v-if="activeTab === TabType.Figma">
        <div class="title">
          <div class="left"></div>
          <span>Figma代码生成</span>
        </div>
        <div class="content">
          <FigmaGenerateCode />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./app-home.scss";
</style>
