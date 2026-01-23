<template>
  <div class="version-info">
    <ElAlert v-for="version in newVersionList" :title="`发现新版本：${version.tag_name}`" type="success" :closable="false">
      <div class="new-version-alert">
        <span v-for="(line, index) in version.body.split('\n')" :key="index">{{ line }}</span>
        <span>发布时间: {{ dayjs(version.published_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
        <a :href="version.html_url" target="_blank">查看详情</a>
        <div class="new-version-assets">
          <a v-for="asset in version.assets" :key="asset.name" :href="asset.browser_download_url" target="_blank">
            {{ asset.name }}
            <ElIcon>
              <Download />
            </ElIcon>
          </a>
        </div>
      </div>
    </ElAlert>
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem>
        <template #label>
          <div class="current-version-label">
            <span>当前版本号</span>
            <ElTag v-if="!loading && newVersionList.length <= 0" type="primary">最新版本</ElTag>
          </div>
        </template>
        v{{ onVersion }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <ElButton :loading="loading" @click="handleGetLatestReleaseVersionList">检测最新版本</ElButton>
  </div>
</template>

<script lang="ts" setup>
import { ElAlert, ElButton, ElDescriptions, ElDescriptionsItem, ElIcon, ElTag } from "element-plus";
import type { Github } from "@taozi-chrome-extensions/common/src/type";
import { onMounted, ref } from "vue";
import { requestReleaseVersionListMessage } from "@taozi-chrome-extensions/common/src/message";
import semver from "semver";
import dayjs from "dayjs";
import { Download } from "@element-plus/icons-vue";

const onVersion = chrome.runtime.getManifest().version;

const loading = ref(false);

const latestReleaseVersionList = ref<Github.Api.ReleaseVersion[]>([]);

const newVersionList = ref<Github.Api.ReleaseVersion[]>([]);

const handleGetLatestReleaseVersionList = async (): Promise<void> => {
  try {
    loading.value = true;

    const res = await requestReleaseVersionListMessage.sendMessage();
    if (res.succeed) {
      latestReleaseVersionList.value = res.data || [];

      newVersionList.value = latestReleaseVersionList.value.filter(item =>
        semver.gt(item.tag_name.replace(/^v-?/i, ""), onVersion)
      );
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
