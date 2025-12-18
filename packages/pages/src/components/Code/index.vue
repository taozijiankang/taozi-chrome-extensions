<template>
  <div class="code-component">
    <div class="code-list">
      <div class="code-container" v-for="(line, index) in lineCode" :key="index">
        <span
          class="code-index"
          :style="{
            width: lineCode.length.toString().length * 8 + 'px',
          }"
        >
          {{ index }}
        </span>
        <code class="code-content" v-html="line.htmlLine" @click="handleCopyCode(line.line)"></code>
      </div>
    </div>
    <div class="con">
      <div class="type" v-if="type">{{ type }}</div>
      <div class="button" @click="handleCopyCode(code)">复制</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { computed } from "vue";
import { parseCode, type CodeType } from "./index";

const props = defineProps<{
  code: string;
  type: CodeType;
}>();

const lineCode = computed(() => {
  return parseCode(props.code, props.type);
});

const handleCopyCode = (code: string) => {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      ElMessage({
        message: "复制成功",
        type: "success",
      });
    })
    .catch(() => {
      ElMessage({
        message: "复制失败",
        type: "error",
      });
    });
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
