<template>
  <div class="con-name-editor">
    <ContentCard title="元素名称" contentBackground="#f7f9fb">
      <TranslateInput v-model:value="con.config.name" />
    </ContentCard>
  </div>
</template>

<script setup lang="ts">
import TranslateInput from "@/components/TranslateInput/index.vue";
import { BaseCon } from "../../controller";
import ContentCard from "@/components/ContentCard/index.vue";

defineProps<{
  con: BaseCon;
}>();
</script>

<style lang="scss" scoped>
@use "./index";
</style>
