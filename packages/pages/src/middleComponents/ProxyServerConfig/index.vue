<template>
  <div class="proxy-server-config">
    <ElAlert title="可以通过阿里云边缘安全加速 ESA 快速部署一个代理服务" type="info" :closable="false" />
    <a target="_blank" href="https://esa.console.aliyun.com/">阿里云边缘安全加速 ESA 控制台</a>
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="api代理服务地址">
        <ElInput type="text" v-model="proxyServiceUrlInput" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem, ElAlert } from "element-plus";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local";

const proxyServiceUrlInput = ref("");

watch([proxyServiceUrlInput], () => {
  configLocalStorage.edit(v => {
    v.proxyServiceUrl = proxyServiceUrlInput.value;
  });
});

onMounted(async () => {
  const { proxyServiceUrl = "" } = (await configLocalStorage.get()) || {};
  proxyServiceUrlInput.value = proxyServiceUrl;
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
