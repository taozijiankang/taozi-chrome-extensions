<template>
  <div class="con-base-editor">
    <ContentCard title="元素基础信息" contentBackground="#f7f9fb">
      <ElForm labelSuffix=":" labelPosition="left">
        <ElFormItem label="启用">
          <ElSwitch
            :model-value="!con.config.disabled"
            @update:model-value="handleDisabled"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </ElFormItem>
        <ElFormItem label="元素名称">
          <TranslateInput v-model:value="con.config.name" />
        </ElFormItem>
        <ElFormItem label="自定义组件名称">
          <ElInput v-model="con.config.customComName" clearable />
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

const handleDisabled = (value: string | number | boolean) => {
  props.con.config.disabled = !value;
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
