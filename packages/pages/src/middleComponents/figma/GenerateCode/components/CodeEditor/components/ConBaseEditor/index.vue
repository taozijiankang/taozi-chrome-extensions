<template>
  <div class="con-base-editor">
    <ContentCard title="元素基础信息" contentBackground="#f7f9fb">
      <div class="con-base-editor-content">
        <ElCheckbox :modelValue="!con.disabled" @update:modelValue="handleDisabled" />
        <TranslateInput class="name-input" v-model:value="con.config.name" />
      </div>
    </ContentCard>
  </div>
</template>

<script setup lang="ts">
import TranslateInput from "@/components/TranslateInput/index.vue";
import { BaseCon } from "../../controller";
import ContentCard from "@/components/ContentCard/index.vue";
import { ElCheckbox } from "element-plus";

const props = defineProps<{
  con: BaseCon;
}>();

const handleDisabled = () => {
  props.con.disabled = !props.con.disabled;
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
