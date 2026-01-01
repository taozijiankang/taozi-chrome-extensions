<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import BaiDuAppConfig from "./middleComponents/BaiDuAppConfig/index.vue";
import GenVarName from "./middleComponents/GenVarName/index.vue";
import Head from "./middleComponents/Head/index.vue";
import Tabs from "./components/Tabs/index.vue";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";
import CodesignRecentViewed from "./middleComponents/codesign/RecentViewed/index.vue";
import CodesignConfig from "./middleComponents/codesign/Config/index.vue";
import ProxyServerConfig from "./middleComponents/ProxyServerConfig/index.vue";
import Version from "./middleComponents/Version/index.vue";
import MpReleasePlan from "./middleComponents/MpReleasePlan/index.vue";
import FigmaConfig from "./middleComponents/figma/Config/index.vue";

enum TabType {
  GenVarName = "GenVarName",
  MpReleasePlan = "MpReleasePlan",
  Codesign = "Codesign",
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
  const { popupActiveTab } = (await configLocalStorage.get()) || {};
  activeTab.value = tabs.value.find(item => item.value === popupActiveTab)?.value || TabType.GenVarName;
});
</script>

<template>
  <div class="popup">
    <div class="head">
      <Head :show-home-button="true" />
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
      <template v-else-if="activeTab === TabType.Config">
        <div class="title">
          <div class="left"></div>
          <span>百度翻译api配置</span>
        </div>
        <div class="content">
          <BaiDuAppConfig />
        </div>
        <div class="title">
          <div class="left"></div>
          <span>figma api配置</span>
        </div>
        <div class="content">
          <FigmaConfig />
        </div>
        <div class="title">
          <div class="left"></div>
          <span>代理服务配置</span>
        </div>
        <div class="content">
          <ProxyServerConfig />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Version">
        <div class="title">
          <div class="left"></div>
          <span>版本信息</span>
        </div>
        <div class="content">
          <Version />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./app-popup.scss";
</style>
