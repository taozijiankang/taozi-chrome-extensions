<template>
  <div class="test">
    <CodeEditor
      class="code-editor"
      :cons="consForEditor"
      :imageAssets="imageAssets"
      :active-node-tree-con-key="activeNodeTreeConKey"
      @update:cons="handleUpdateCons"
      @update:active-node-tree-con-key="handleUpdateActiveNodeTreeConKey"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { testFigmaAssetsData as testFigmaAssetsData_ } from "./data/index";
import { byFigmaAssetsGetCons } from "../utils/byFigmaAssetsGetCons";
import { BaseCon } from "../GenerateCode/components/CodeEditor/controller";
import CodeEditor from "../GenerateCode/components/CodeEditor/index.vue";
import { cloneCons, exportConfigs } from "../GenerateCode/components/CodeEditor/utils";

const testFigmaAssetsData = ref(testFigmaAssetsData_);

const cons = ref<BaseCon[]>([]);
const imageAssets = ref<string[]>([]);

const activeNodeTreeConKey = ref("");

const consForEditor = computed(() => cons.value as BaseCon[]);

const handleUpdateCons = (cons_: BaseCon[]) => {
  cons.value = cons_;
};

const handleUpdateActiveNodeTreeConKey = (key: string) => {
  activeNodeTreeConKey.value = key;
};

onMounted(async () => {
  const con = byFigmaAssetsGetCons(testFigmaAssetsData.value);

  imageAssets.value = testFigmaAssetsData.value.images.map(item => item.url);

  if (con) {
    cons.value.push(con);
  }

  console.log("cons", cons.value);
  console.log("exportConfigs", exportConfigs([con!]));

  const cons2 = cloneCons([con!]);

  console.log("cons2", cons2);
  console.log("exportConfigs2", exportConfigs(cons2));

  cons.value.push(...cons2);
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
