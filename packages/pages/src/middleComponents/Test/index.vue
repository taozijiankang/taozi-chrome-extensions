<template>
  <div class="test">
    <ElTabs v-model="activeTab">
      <ElTabPane label="Test" :name="TabType.Test">
        <Code :code="formattedJsCode" :type="CodeType.Vue" />
      </ElTabPane>
      <ElTabPane label="Version" :name="TabType.Version">
        <Version />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { ElTabs, ElTabPane } from "element-plus";
import Code from "../../components/Code/index.vue";
import { CodeType } from "../../components/Code/index";
import { onMounted, ref } from "vue";
import { formatCode } from "../../utils/prettier";
import { parseHtmlScss } from ".";
import Version from "../Version/index.vue";

enum TabType {
  Test = "Test",
  Version = "Version"
}

const activeTab = ref(TabType.Test);

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
    		<img class="frame-child" alt="">
    		
    		<div class="frame-group">
      			<div class="parent">
        				<div class="div">李善福</div>
        				<div class="wrapper">
          					<div class="div2">未绑定</div>
        				</div>
      			</div>
      			<div class="group">
        				<div class="div2">主任医师</div>
        				<div class="div4">丨</div>
        				<div class="div2">肿瘤科</div>
      			</div>
      			<div class="frame-container">
        				<div class="frame-div">
          					<img class="frame-item" alt="">
          					
          					<div class="div6">三甲</div>
        				</div>
        				<div class="div7">四川省华西医院</div>
      			</div>
    		</div>
  	</div>
  	
  	
  	
  	
</body>
</html>
`;

const cssCode = `
.frame-parent {
  	width: 100%;
  	position: relative;
  	border-radius: 8px;
  	background-color: #fff;
  	display: flex;
  	align-items: flex-start;
  	padding: 12px;
  	box-sizing: border-box;
  	gap: 8px;
  	text-align: left;
  	font-size: 16px;
  	color: #333;
  	font-family: 'PingFang SC';
}
.frame-child {
  	height: 40px;
  	width: 40px;
  	object-fit: contain;
  	flex-shrink: 0;
}
.frame-group {
  	width: 199px;
  	display: flex;
  	flex-direction: column;
  	align-items: flex-start;
  	gap: 4px;
  	flex-shrink: 0;
}
.parent {
  	display: flex;
  	align-items: center;
  	gap: 8px;
}
.div {
  	position: relative;
  	line-height: 120%;
  	font-weight: 500;
}
.wrapper {
  	border-radius: 3px;
  	background-color: #e5ecff;
  	border: 0.5px solid rgba(79, 125, 254, 0.5);
  	display: flex;
  	align-items: center;
  	justify-content: center;
  	padding: 2px 4px;
  	font-size: 12px;
  	color: #1c58ff;
}
.div2 {
  	position: relative;
  	line-height: 120%;
}
.group {
  	display: flex;
  	align-items: center;
  	font-size: 13px;
  	color: #999;
}
.div4 {
  	position: relative;
  	font-size: 14px;
  	line-height: 120%;
  	color: #ccc;
}
.frame-container {
  	align-self: stretch;
  	display: flex;
  	align-items: center;
  	gap: 6px;
  	font-size: 11px;
  	color: #fff;
}
.frame-div {
  	border-radius: 2px;
  	background-color: #387af6;
  	display: none;
  	align-items: center;
  	justify-content: center;
  	padding: 2px 4px 2px 3px;
  	gap: 2px;
}
.frame-item {
  	height: 12px;
  	width: 12px;
  	position: relative;
}
.div6 {
  	position: relative;
  	line-height: 13px;
}
.div7 {
  	flex: 1;
  	position: relative;
  	font-size: 13px;
  	line-height: 120%;
  	color: #999;
}


`;

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
