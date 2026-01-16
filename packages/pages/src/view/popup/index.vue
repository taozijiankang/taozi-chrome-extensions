<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, computed } from "vue";
import BaiDuAppConfig from "../../middleComponents/BaiDuAppConfig/index.vue";
import GenVarName from "../../middleComponents/GenVarName/index.vue";
import Head from "../../middleComponents/Head/index.vue";
import Tabs from "../../components/Tabs/index.vue";
import { configLocalStorage, messageAlertLocalStorage, type MessageAlertItem } from "@taozi-chrome-extensions/common/src/local";
import CodesignRecentViewed from "../../middleComponents/codesign/RecentViewed/index.vue";
import CodesignConfig from "../../middleComponents/codesign/Config/index.vue";
import Version from "../../middleComponents/Version/index.vue";
import MpReleasePlan from "../../middleComponents/MpReleasePlan/index.vue";
import { openPage } from "@taozi-chrome-extensions/common/src/utils/openPage";
import { Page } from "@taozi-chrome-extensions/common/src/constant/page";
import { ElButton } from "element-plus";
import FigmaConfig from "../../middleComponents/figma/Config/index.vue";
import CodeSubmit from "../../middleComponents/CodeSubmit/index.vue";
import ContentCard from "../../components/ContentCard/index.vue";
import { MessageAlertType } from "@taozi-chrome-extensions/common/src/constant";
import type { TabItem } from "../../components/Tabs/index";
import OpenAIConfig from "../../middleComponents/OpenAIConfig/index.vue";

enum TabType {
  Agent = "Agent",
  GenVarName = "GenVarName",
  MpReleasePlan = "MpReleasePlan",
  Codesign = "Codesign",
  Figma = "Figma",
  Config = "Config",
  Version = "Version"
}

const messageAlerts = ref<MessageAlertItem[]>([]);

const handleOpenAgentPage = async () => {
  await openPage(Page.Agent);
};

const tabs = computed<TabItem[]>(() => {
  return [
    {
      label: "Agent",
      value: TabType.Agent,
      click: handleOpenAgentPage
    },
    {
      label: "生成变量名",
      value: TabType.GenVarName
    },
    {
      label: "小程序发版计划",
      value: TabType.MpReleasePlan,
      badgeCount: messageAlerts.value.find(item => item.type === MessageAlertType.HasMpReleasePlan)?.count
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
      value: TabType.Version,
      isDot: messageAlerts.value.some(item => item.type === MessageAlertType.HasNewVersion)
    }
  ];
});
const activeTab = ref(TabType.Agent);

watch(activeTab, () => {
  configLocalStorage.edit(v => {
    v.popupActiveTab = activeTab.value;
  });
});

const getMessageAlertsTimer = ref<ReturnType<typeof setInterval> | null>(null);

const getMessageAlerts = async () => {
  const { messageAlerts: messageAlertsData = [] } = (await messageAlertLocalStorage.get()) || {};
  messageAlerts.value = messageAlertsData;
};

const handleOpenFigmaPage = async () => {
  await openPage(Page.Figma);
};

onMounted(async () => {
  const { popupActiveTab } = (await configLocalStorage.get()) || {};
  const targetTab = (tabs.value.find(item => item.value === popupActiveTab)?.value as TabType) || TabType.GenVarName;
  // 如果保存的 tab 是 Agent，则默认显示 GenVarName
  activeTab.value = targetTab === TabType.Agent ? TabType.GenVarName : targetTab;

  getMessageAlerts();
  getMessageAlertsTimer.value = setInterval(getMessageAlerts, 300);
});

onUnmounted(() => {
  if (getMessageAlertsTimer.value) {
    clearInterval(getMessageAlertsTimer.value);
  }
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
        <ContentCard>
          <GenVarName />
        </ContentCard>
      </template>
      <template v-else-if="activeTab === TabType.MpReleasePlan">
        <ContentCard>
          <MpReleasePlan />
        </ContentCard>
      </template>
      <template v-else-if="activeTab === TabType.Codesign">
        <ContentCard title="最近浏览">
          <CodesignRecentViewed />
        </ContentCard>
        <ContentCard title="配置">
          <CodesignConfig />
        </ContentCard>
      </template>
      <template v-else-if="activeTab === TabType.Figma">
        <ElButton type="primary" @click="handleOpenFigmaPage"> 打开Figma 控制台页面 </ElButton>
        <ContentCard title="配置">
          <FigmaConfig />
        </ContentCard>
      </template>
      <template v-else-if="activeTab === TabType.Config">
        <ContentCard title="百度翻译api配置">
          <BaiDuAppConfig />
        </ContentCard>
        <ContentCard title="OpenAI API配置">
          <OpenAIConfig />
        </ContentCard>
      </template>
      <template v-else-if="activeTab === TabType.Version">
        <ContentCard title="版本信息" :alert="messageAlerts.some(item => item.type === MessageAlertType.HasNewVersion)">
          <Version />
        </ContentCard>
        <ContentCard title="提交信息">
          <CodeSubmit />
        </ContentCard>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index.scss";
</style>
