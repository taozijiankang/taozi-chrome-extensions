<template>
  <div class="code-format">
    <Code :code="formattedJsCode" :type="CodeType.Ts" />
    <Code :code="formattedHtmlCode" :type="CodeType.Html" />
    <Code :code="formattedCssCode" :type="CodeType.Css" />
  </div>
</template>

<script setup lang="ts">
import Code from "../../../components/Code/index.vue";
import { CodeType } from "../../../components/Code/index";
import { onMounted, ref } from "vue";
import { formatCode } from "../../../utils/prettier";

const jsCode = ref(`
const a = \`https://com-shuibei-peach-pharmacy.100cbc.com/rp/210304103256552626/26011311342061976120201240.png\`
  const a = 1;
  const b = 2;
  const c = a + b;
  console.log(c);
`);
const htmlCode = ref(`
<!DOCTYPE html>
<img src="https://com-shuibei-peach-pharmacy.100cbc.com/rp/210304103256552626/26011311342061976120201240.png" alt="Random Image" />
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
  <div class="container">
    <img src="https://com-shuibei-peach-pharmacy.100cbc.com/rp/210304103256552626/26011311342061976120201240.png" alt="Random Image" />
              <div class="item">Item 1</div>
              <div class="item">Item 2</div>
              <div class="item">Item 3</div>
  </div>
</body>
</html>
`);
const cssCode = ref(`
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  width: 100px;
  height: 100px;
  background-color: red;
}
`);

const formattedJsCode = ref("");
const formattedHtmlCode = ref("");
const formattedCssCode = ref("");

onMounted(async () => {
  formattedJsCode.value = (await formatCode(jsCode.value, "typescript")).trim();
  formattedHtmlCode.value = (await formatCode(htmlCode.value, "html")).trim();
  formattedCssCode.value = (await formatCode(cssCode.value, "scss")).trim();
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
