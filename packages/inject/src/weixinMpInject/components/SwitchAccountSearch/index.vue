<template>
  <div class="switch-account-search">
    <div class="search">
      <ElText size="small" class="search-text" type="info">共有 {{ props.wxaList.length }} 个小程序</ElText>
      <ElInput v-model="searchInput" placeholder="输入小程序名称,原始id,appid搜索" @input="handleSearch" clearable>
        <template #append>
          <ElButton :icon="Search" @click="handleSearch" />
        </template>
      </ElInput>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElButton, ElText } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import type { WXMPItem } from "../../api/type";
import { weixinLocalStorage } from "@taozi-chrome-extensions/common/src/local/weixin";

const props = defineProps<{
  wxaList: WXMPItem[];
}>();

const emit = defineEmits<{
  (e: "search", value: string): void;
}>();

const searchInput = ref("");

const handleSearch = () => {
  emit("search", searchInput.value);
};

onMounted(async () => {
  const { searchInput: searchInput_ = "" } = (await weixinLocalStorage.get()) || {};
  searchInput.value = searchInput_;

  handleSearch();
});

watch(searchInput, () => {
  weixinLocalStorage.edit(v => {
    v.searchInput = searchInput.value;
  });
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
