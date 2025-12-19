<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import BaiDuAppConfig from "./components/BaiDuAppConfig/index.vue";
import GenVarName from "./components/GenVarName/index.vue";
import Head from "./components/Head/index.vue";
import Tabs from "./components/Tabs/index.vue";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";
import CodesignRecentViewed from "./components/Codesign/recentViewed.vue";
import CodesignConfig from "./components/Codesign/config.vue";
import ProxyServerConfig from "./components/ProxyServerConfig/index.vue";
import Commit from "./components/Version/commit.vue";
import MpReleasePlan from "./components/MpReleasePlan/index.vue";
import FigmaGenerateCode from "./components/figma/FigmaGenerateCode/index.vue";

enum TabType {
  GenVarName = "GenVarName",
  MpReleasePlan = "MpReleasePlan",
  Codesign = "Codesign",
  Figma = "Figma",
  Config = "Config",
  Version = "Version"
}
const tabs = ref<
  {
    label: string;
    value: TabType;
  }[]
>([
  {
    label: "生成变量名",
    value: TabType.GenVarName
  },
  {
    label: "小程序发版计划",
    value: TabType.MpReleasePlan
  },

  {
    label: "Codesign",
    value: TabType.Codesign
  },
  {
    label: "Figma",
    value: TabType.Figma
  },
  {
    label: "项目配置",
    value: TabType.Config
  },
  {
    label: "版本信息",
    value: TabType.Version
  }
]);
const activeTab = ref(TabType.GenVarName);

watch(activeTab, () => {
  configLocalStorage.edit(v => {
    v.popupActiveTab = activeTab.value;
  });
});

onMounted(async () => {
  activeTab.value = ((await configLocalStorage.get())?.popupActiveTab as TabType) || TabType.GenVarName;
});
</script>

<template>
  <div class="popup">
    <div class="head">
      <Head />
    </div>
    <Tabs v-model:value="activeTab" :list="tabs" class="tabs" />
    <div class="content-container">
      <template v-if="activeTab === TabType.GenVarName">
        <div class="content">
          <GenVarName />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.MpReleasePlan">
        <div class="content">
          <MpReleasePlan />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Codesign">
        <div class="title">
          <div class="left"></div>
          <span>最近浏览</span>
        </div>
        <div class="content">
          <CodesignRecentViewed />
        </div>
        <div class="title">
          <div class="left"></div>
          <span>配置</span>
        </div>
        <div class="content">
          <CodesignConfig />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Figma">
        <div class="title">
          <div class="left"></div>
          <span>Figma代码生成</span>
        </div>
        <div class="content">
          <FigmaGenerateCode />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Config">
        <div class="title">
          <div class="left"></div>
          <span>代理服务配置</span>
        </div>
        <div class="content">
          <ProxyServerConfig />
        </div>
        <div class="title">
          <div class="left"></div>
          <span>百度翻译api配置</span>
        </div>
        <div class="content">
          <BaiDuAppConfig />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Version">
        <div class="title">
          <div class="left"></div>
          <span>代码提交</span>
        </div>
        <div class="content">
          <Commit />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  width: 750px;
  position: relative;
  height: 500px;
  overflow-y: auto;
  background: #f7f7f7;
  > .tabs {
    background-color: white;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.03);
    --color: #666666;
    --on-color: #409eff;
    --background-color: #ffffff;
    --on-background-color: #f7f7f7;
    --font-size: 14px;
    --padding: 8px 12px;
  }
  > .head {
    background-color: white;
    padding: 12px;
    box-sizing: border-box;
  }
  > .content-container {
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .title {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      display: flex;
      align-items: center;
      gap: 6px;
      .left {
        height: 16px;
        border-radius: 4px;
        width: 4px;
        background-color: #409eff;
      }
    }
    .content {
      background-color: #ffffff;
      border-radius: 12px;
      box-sizing: border-box;
      padding: 12px;
    }
  }
}
</style>
