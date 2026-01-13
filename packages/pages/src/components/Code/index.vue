<template>
  <div class="code-component">
    <div class="code-list-container" ref="codeContainerRef">
      <div
        class="code-line"
        v-for="(parsedLine, index) in parsedLines"
        :key="index"
        :class="{ 'line-hover': hoveredLineIndex === index, 'has-image': parsedLine.imageUrl }"
        :style="{ '--line-number-width': lineNumberWidth + 'px' }"
        @mouseenter="hoveredLineIndex = index"
        @mouseleave="hoveredLineIndex = null"
      >
        <span
          class="line-number"
          :style="{
            width: lineNumberWidth + 'px'
          }"
          @click="handleCopyLine(parsedLine.line)"
        >
          {{ index + 1 }}
        </span>
        <div v-if="parsedLine.imageUrl" class="line-image">
          <img :src="parsedLine.imageUrl" alt="Preview" @error="handleImageError" />
        </div>
        <code class="code-content" @click="handleCopyLine(parsedLine.line)">
          <span
            v-for="(token, tokenIndex) in parsedLine.tokens"
            :key="tokenIndex"
            :class="['token', `token-${token.type}`]"
            :style="token.style"
          >
            {{ token.value }}
          </span>
        </code>
      </div>
    </div>
    <div class="code-actions">
      <div class="code-type" v-if="type">{{ type.toUpperCase() }}</div>
      <button
        class="copy-button"
        @click="handleCopyAll"
        :class="{ 'copy-success': copySuccess }"
        :title="copySuccess ? '已复制' : '复制全部'"
      >
        <span v-if="!copySuccess">复制</span>
        <span v-else>✓</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { computed, ref, watch, onMounted } from "vue";
import { parseCode, type CodeType, type ParsedLine } from "./index";

const props = defineProps<{
  code: string;
  type: CodeType;
}>();

const codeContainerRef = ref<HTMLElement | null>(null);
const hoveredLineIndex = ref<number | null>(null);
const copySuccess = ref(false);
const lineNumberWidth = ref(40);

const parsedLines = computed<ParsedLine[]>(() => {
  return parseCode(props.code, props.type);
});

// 计算行号宽度
const calculateLineNumberWidth = () => {
  const lineCount = parsedLines.value.length;
  const digits = lineCount.toString().length;
  // 每个数字约 8px，加上 padding
  lineNumberWidth.value = Math.max(40, digits * 8 + 16);
};

watch(() => parsedLines.value.length, calculateLineNumberWidth, { immediate: true });

const handleCopyLine = async (line: string) => {
  try {
    await navigator.clipboard.writeText(line);
    ElMessage({
      message: "已复制行",
      type: "success",
      duration: 1500
    });
  } catch (error) {
    ElMessage({
      message: "复制失败",
      type: "error"
    });
  }
};

const handleCopyAll = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copySuccess.value = true;
    ElMessage({
      message: "复制成功",
      type: "success",
      duration: 1500
    });
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (error) {
    ElMessage({
      message: "复制失败",
      type: "error"
    });
  }
};

const handleImageError = (event: Event) => {
  // 图片加载失败时隐藏图片
  const img = event.target as HTMLImageElement;
  if (img && img.parentElement) {
    img.parentElement.style.display = "none";
  }
};

onMounted(() => {
  calculateLineNumberWidth();
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
