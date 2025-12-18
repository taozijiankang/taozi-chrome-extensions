<template>
  <div class="generate-code">
    <ElButton type="primary" @click="handleGenerateCode" :loading="generateCodeLoading">生成代码</ElButton>
    <span v-if="getBaseCodesErrorStr" class="error-text">{{ getBaseCodesErrorStr }}</span>

    <Dialog ref="dialogRef" />
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElMessage } from "element-plus";
import { ref } from "vue";
import { getBaseCodes, getAssets } from "../../elController";
import Dialog from "./components/Dialog/index.vue";

const generateCodeLoading = ref(false);

const dialogRef = ref<InstanceType<typeof Dialog>>();

const getBaseCodesErrorStr = ref("");

const handleGenerateCode = async () => {
  console.log("生成代码");
  generateCodeLoading.value = true;
  try {
    const codesData = await getBaseCodes();

    const assetsData = await getAssets();

    getBaseCodesErrorStr.value = "";

    await dialogRef.value?.handleShowCodesDialog(codesData, assetsData);
  } catch (error) {
    console.error("生成代码失败", error);
    getBaseCodesErrorStr.value = String(error);
  } finally {
    generateCodeLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
