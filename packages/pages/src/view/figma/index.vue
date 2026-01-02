<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Head from "../../middleComponents/Head/index.vue";
import Tabs from "../../components/Tabs/index.vue";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local";
import FigmaGenerateCode from "../../middleComponents/figma/GenerateCode/index.vue";
import FigmaConfig from "../../middleComponents/figma/Config/index.vue";
import ContentCard from "../../components/ContentCard/index.vue";

enum TabType {
  CodeGenerate = "CodeGenerate",
  Config = "Config"
}

const tabs = ref<
  {
    label: string;
    value: TabType;
  }[]
>([
  {
    label: "代码生成",
    value: TabType.CodeGenerate
  },
  {
    label: "配置",
    value: TabType.Config
  }
]);

const activeTab = ref(TabType.CodeGenerate);

watch(activeTab, () => {
  figmaLocalStorage.edit(v => {
    v.activeTab = activeTab.value;
  });
});

onMounted(async () => {
  const { activeTab: activeTabValue } = (await figmaLocalStorage.get()) || {};
  activeTab.value = tabs.value.find(item => item.value === activeTabValue)?.value || TabType.CodeGenerate;
});
</script>

<template>
  <div class="figma">
    <div class="top">
      <div class="head">
        <Head title="Figma控制台" />
      </div>
      <Tabs v-model:value="activeTab" :list="tabs" class="tabs" />
    </div>
    <div class="content-container">
      <template v-if="activeTab === TabType.CodeGenerate">
        <ContentCard title="Figma代码生成">
          <FigmaGenerateCode />
        </ContentCard>
      </template>
      <template v-if="activeTab === TabType.Config">
        <ContentCard title="配置">
          <FigmaConfig />
        </ContentCard>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index.scss";
</style>
