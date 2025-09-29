<template>
  <div class="switch-account-search">
    <ElInput v-model="searchInput" placeholder="搜索" @input="handleSearch" clearable>
      <template #append>
        <elButton :icon="Search" @click="handleSearch" />
      </template>
    </ElInput>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElButton } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { weixinMpLocalStorage } from "@taozi-chrome-extensions/common/src/local/weixinMp";

const emit = defineEmits<{
  (e: "search", value: string): void;
}>();

const searchInput = ref("");

const handleSearch = () => {
  emit("search", searchInput.value);
};

onMounted(async () => {
  const { searchInput: searchInput_ = "" } = (await weixinMpLocalStorage.get()) || {};
  searchInput.value = searchInput_;

  handleSearch();
});

watch(searchInput, () => {
  weixinMpLocalStorage.edit((v) => {
    v.searchInput = searchInput.value;
  });
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
