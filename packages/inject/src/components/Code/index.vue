<template>
  <div class="code">
    <pre class="code-pre">
      <code v-for="(line, index) in lineCode" :key="index" @click="handleCopyCode(line.line)" v-html="line.htmlLine"></code>
    </pre>
    <div class="con">
      <div class="type" v-if="type">{{ type }}</div>
      <div class="button" @click="handleCopyCode(code)">复制</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { computed } from "vue";
import { parseCode, type CodeType } from ".";

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
.code {
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

  .code-pre {
    line-height: 1.5;
    font-size: 12px;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    code {
      white-space: pre-wrap;
      word-break: break-all;
      font-family: Consolas;

      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
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
