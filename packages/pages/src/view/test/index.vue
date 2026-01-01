<template>
  <div class="test">
    <Code :code="formattedJsCode" :type="CodeType.Js" />
  </div>
</template>

<script setup lang="ts">
import Code from "../../components/Code/index.vue";
import { CodeType } from "../../components/Code/index";
import { onMounted, ref } from "vue";
import { formatCode } from "../../utils/prettier";
import { parseHtmlScss } from ".";

const jsCode = `
  const a = 1;
  const b = 2;
  const c = a + b;
  console.log(c);
`;

const htmlCode = `
<!DOCTYPE html>
<html>
<head>
  	<meta charset="utf-8">
  	<meta name="viewport" content="initial-scale=1, width=device-width">
  	
  	<link rel="stylesheet"  href="./index.css" />
  	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=[object Object]&display=swap" />
  	
  	
  	
</head>
<body>
  	
  	<div class="frame-parent">
    		<div class="frame-group">
      			<div class="parent">
        				<div class="div">合作药企</div>
        				<div class="div2">平均 60 秒接诊</div>
      			</div>
      			<div class="group">
        				<div class="div3">共 13 家药企</div>
        				<img class="frame-icon" alt="">
        				
      			</div>
    		</div>
    		<div class="frame-container">
      			<div class="frame-div">
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">美国强生</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">辉瑞制药</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">罗氏制药</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">诺华制药</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">默沙东</div>
        				</div>
      			</div>
      			<div class="frame-div">
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">艾伯维</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">‌‌阿斯利康</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">赛诺菲</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">拜耳</div>
        				</div>
        				<div class="rectangle-parent">
          					<img class="frame-child" alt="">
          					
          					<div class="div4">武田制药</div>
        				</div>
      			</div>
    		</div>
  	</div>
  	
  	
  	
  	
</body>
</html>
`;

const cssCode = ``;

const formattedJsCode = ref("");

onMounted(async () => {
  formattedJsCode.value = await formatCode(jsCode, "typescript");

  const a = parseHtmlScss(htmlCode, cssCode);
  console.log(a);
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
