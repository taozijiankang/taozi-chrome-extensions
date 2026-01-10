<template>
  <div class="con-base-editor">
    <ContentCard title="元素基础信息" contentBackground="#f7f9fb">
      <ElForm labelSuffix=":" labelPosition="left">
        <ElFormItem label="禁用">
          <ElSwitch v-model="con.config.disabled" />
        </ElFormItem>
        <ElFormItem label="自定义组件名称">
          <ElInput v-model="con.config.customComName" clearable />
        </ElFormItem>
        <ElFormItem label="元素名称">
          <TranslateInput v-model:value="con.config.name" />
        </ElFormItem>
      </ElForm>
    </ContentCard>
  </div>
</template>

<script setup lang="ts">
import TranslateInput from "@/components/TranslateInput/index.vue";
import { BaseCon } from "../../controller";
import ContentCard from "@/components/ContentCard/index.vue";
import { ElForm, ElFormItem, ElInput, ElSwitch } from "element-plus";

const props = defineProps<{
  con: BaseCon;
}>();
</script>

<style lang="scss" scoped>
@use "./index";
</style>
