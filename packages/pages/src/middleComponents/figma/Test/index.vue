<template>
  <div class="test">
    <CodeEditor class="code-editor" :cons="consForEditor" :imageAssets="imageAssets" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { testFigmaAssetsData as testFigmaAssetsData_ } from "./data/index";
import { byFigmaAssetsGetCons } from "../utils/byFigmaAssetsGetCons";
import { BaseCon } from "../GenerateCode/components/CodeEditor/controller";
import CodeEditor from "../GenerateCode/components/CodeEditor/index.vue";

const testFigmaAssetsData = ref(testFigmaAssetsData_);

const cons = ref<BaseCon[]>([]);

const imageAssets = ref<string[]>([]);

const consForEditor = computed(() => cons.value as BaseCon[]);

onMounted(async () => {
  const con = byFigmaAssetsGetCons(testFigmaAssetsData.value);

  imageAssets.value = testFigmaAssetsData.value.images.map(item => item.url);

  if (con) {
    cons.value.push(con);
  }

  console.log(cons.value);
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
