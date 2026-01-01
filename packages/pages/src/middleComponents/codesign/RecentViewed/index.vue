<template>
  <div class="codesign-recent-viewed">
    <div class="list">
      <template v-if="loading">
        <ElSkeleton v-for="i in 4" :key="i" :rows="4" animated />
      </template>
      <template v-else-if="list.length > 0">
        <div class="recent-viewed-item" v-for="item in list" :key="item.id" @click="handleClick(item)">
          <div class="recent-viewed-item-cover">
            <img :src="item.cover_url || item.fallback_cover_url" alt="" />
            <span class="model">{{ item.model === "design" ? "设计图" : "原型图" }}</span>
          </div>
          <div class="recent-viewed-item-info">
            <span class="name">{{ item.name }}</span>
            <span class="update-time"
              >{{ dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss") }} 由 {{ item.updater.nickname }} 更新</span
            >
          </div>
        </div>
      </template>
    </div>
    <ElEmpty v-if="!loading && list.length <= 0" description="暂无最近浏览" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { requestUser, requestRecentViewed } from "../api";
import type { RecentViewedItem } from "../api/type";
import { ElMessage, ElEmpty, ElSkeleton } from "element-plus";
import dayjs from "dayjs";

const loading = ref(false);
const list = ref<RecentViewedItem[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    const user = await requestUser();
    const { data: recentViewed } = await requestRecentViewed(user.last_team_id);
    list.value = recentViewed;
  } catch (error: any) {
    ElMessage.error(error.toString());
  } finally {
    loading.value = false;
  }
});

const handleClick = async (item: RecentViewedItem) => {
  let url = "";
  if (item.model === "prototype") {
    url = `https://codesign.qq.com/app/prototype/${item.id}/detail`;
  } else if (item.model === "design") {
    url = `https://codesign.qq.com/app/design/${item.id}/board`;
  }
  if (!url) return;
  const [targetTab] = await chrome.tabs.query({
    url
  });
  if (targetTab) {
    chrome.tabs.update(targetTab.id!, { active: true });
  } else {
    chrome.tabs.create({ url });
  }
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
