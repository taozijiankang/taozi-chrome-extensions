<template>
  <div class="version-info">
    <ElAlert v-if="newVersion" :title="`发现新版本：${newVersion.tag_name}`" type="success" :closable="false">
      <div class="new-version-alert">
        <span v-if="newVersion.body">{{ newVersion.body }}</span>
        <span>发布时间: {{ dayjs(newVersion.published_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
        <a :href="newVersion.html_url" target="_blank">查看详情</a>
        <div class="new-version-assets">
          <a v-for="asset in newVersion.assets" :key="asset.name" :href="asset.browser_download_url" target="_blank">
            {{ asset.name }}
            <ElIcon>
              <Download />
            </ElIcon>
          </a>
        </div>
      </div>
    </ElAlert>
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem :label="`当前版本号${newVersionList.length > 0 ? '（有新版本）' : '（最新版本）'}`">
        {{ onVersion }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <ElButton :loading="loading" @click="handleGetLatestReleaseVersionList">检测最新版本</ElButton>
  </div>
</template>

<script lang="ts" setup>
import { ElAlert, ElButton, ElDescriptions, ElDescriptionsItem, ElIcon } from "element-plus";
import type { Github } from "@taozi-chrome-extensions/common/src/type";
import { computed, onMounted, ref } from "vue";
import { requestReleaseVersionListMessage } from "@taozi-chrome-extensions/common/src/message";
import semver from "semver";
import dayjs from "dayjs";
import { Download } from "@element-plus/icons-vue";

const onVersion = chrome.runtime.getManifest().version;

const loading = ref(false);

const latestReleaseVersionList = ref<Github.ReleaseVersion[]>([]);

const newVersionList = ref<Github.ReleaseVersion[]>([]);

const newVersion = computed(() => {
  if (newVersionList.value.length > 0) {
    return newVersionList.value.slice(0, 1)[0];
  }
  return null;
});

const handleGetLatestReleaseVersionList = async () => {
  try {
    loading.value = true;

    const res = await requestReleaseVersionListMessage.sendMessage();
    if (res.succeed) {
      latestReleaseVersionList.value = res.data || [];

      newVersionList.value = latestReleaseVersionList.value.filter(item => semver.gt(item.tag_name, onVersion));
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await handleGetLatestReleaseVersionList();
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
