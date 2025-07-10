<template>
  <div class="code-component">
    <div class="code-list">
      <div class="code-container" v-for="(line, index) in lineCode" :key="index">
        <span
          class="code-index"
          :style="{
            width: lineCode.length.toString().length * 7 + 'px'
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
        type: "success"
      });
    })
    .catch(() => {
      ElMessage({
        message: "复制失败",
        type: "error"
      });
    });
};
</script>

<style lang="scss" scoped>
.code-component {
  border-radius: 6px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.04);
  cursor: text;
  padding: 6px;
  box-sizing: border-box;
  width: 100%;
  gap: 6px;
  display: flex;
  align-items: flex-start;

  .code-list {
    line-height: 1.5;
    font-size: 12px;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    .code-container {
      display: flex;
      align-items: start;
      .code-index {
        display: inline-block;
        color: #00000080;
        flex-shrink: 0;
        padding-right: 6px;
      }
      .code-content {
        white-space: pre-wrap;
        word-break: break-all;
        font-family: Consolas;
        min-height: 0;
        flex: 1;
        &:hover {
          background-color: rgba(0, 0, 0, 0.08);
        }
      }
    }
  }
  .con {
    display: flex;
    flex-direction: column;
    gap: 6px;
    .button,
    .type {
      line-height: 1;
      white-space: nowrap;
      writing-mode: vertical-rl;
      font-family: emoji;
    }
    .button {
      padding: 3px;
      background-color: white;
      border-radius: 3px;
      cursor: pointer;
      &:hover {
        color: #0064ff;
      }
    }
  }
}
</style>
