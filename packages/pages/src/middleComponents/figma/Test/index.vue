<template>
  <div class="test"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { parseHtmlCss } from "../utils/parseHtmlCss";
import { testFigmaAssetsData as testFigmaAssetsData_ } from "./data/index";

const testFigmaAssetsData = ref(testFigmaAssetsData_);

onMounted(async () => {
  const htmlContent = testFigmaAssetsData.value.codes.find(item => item.lang === "html")?.content;
  const cssContent = testFigmaAssetsData.value.codes.find(item => item.lang === "css")?.content;
  const a = parseHtmlCss(htmlContent || "", cssContent || "");

  console.log(a);
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
