<template>
  <div class="baidu-app-config">
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="生成文本css样式时忽略字体样式">
        <ElSwitch v-model="ignoreCssFontFamily" />
      </ElFormItem>
      <ElFormItem label="在有padding属性时加入box-sizing: border-box">
        <ElSwitch v-model="boxSizing" />
      </ElFormItem>
      <ElFormItem label="reactCssModule名称">
        <ElInput v-model="reactCssModuleName" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElForm, ElFormItem, ElSwitch, ElInput } from "element-plus";
import { codesignLocalStorage } from "@taozi-chrome-extensions/common/src/local/codesign";

const ignoreCssFontFamily = ref(false);
const boxSizing = ref(false);
const reactCssModuleName = ref("");

watch(
  [ignoreCssFontFamily, boxSizing, reactCssModuleName],
  () => {
    codesignLocalStorage.edit(v => {
      v.config = {
        ignoreCssFontFamily: ignoreCssFontFamily.value,
        boxSizing: boxSizing.value,
        reactCssModuleName: reactCssModuleName.value
      };
    });
  },
  { deep: true }
);

onMounted(async () => {
  const {
    config: {
      ignoreCssFontFamily: ignoreCssFontFamily_ = false,
      boxSizing: boxSizing_ = false,
      reactCssModuleName: reactCssModuleName_ = ""
    } = {}
  } = (await codesignLocalStorage.get()) || {};

  ignoreCssFontFamily.value = ignoreCssFontFamily_;
  boxSizing.value = boxSizing_;
  reactCssModuleName.value = reactCssModuleName_;
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
