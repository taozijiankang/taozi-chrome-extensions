<template>
  <div class="text-editor">
    <ContentCard title="文本" contentBackground="#f7f9fb">
      <ElInput v-model="con.config.text" type="textarea" :rows="5" />
    </ContentCard>
  </div>
</template>

<script setup lang="ts">
import ContentCard from "@/components/ContentCard/index.vue";
import { ElInput } from "element-plus";
import { SpanCon } from "../../controller";

defineProps<{
  con: SpanCon;
}>();
</script>

<style lang="scss" scoped>
@use "./index";
</style>
