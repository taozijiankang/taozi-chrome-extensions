<template>
  <div class="gen-var-name">
    <ElInput type="text" v-model="input" @keydown.enter="handleClick" placeholder="请输入...">
      <template #append>
        <ElButton type="primary" @click="handleClick" :loading="loading">确定</ElButton>
      </template>
    </ElInput>
    <ElSkeleton v-if="loading" :rows="3" animated />
    <template v-else-if="results.length > 0">
      <div class="results-container">
        <div v-for="(result, index) in results" :key="index" class="result-group">
          <span v-for="(value, key) in result" :key="key" class="try-result" @click="handleCodeItem(value)">
            {{ value }}
          </span>
        </div>
      </div>
    </template>
    <ElEmpty v-else description="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElButton, ElMessage, ElEmpty, ElSkeleton } from "element-plus";
import { kebabToCamelCase, camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { genVarNameLocalStorage } from "@taozi-chrome-extensions/common/src/local";
import { baiduTranslateMessage } from "@taozi-chrome-extensions/common/src/message";

// Types
type ResultType = {
  camelCase: string;
  pascalCase: string;
  kebabCase: string;
};

// State
const input = ref("");
const loading = ref(false);
const results = ref<ResultType[]>([]);

// Watchers
watch(input, () => {
  genVarNameLocalStorage.edit(v => {
    v.genVarNameInput = input.value;
  });
});

// Methods
const handleClick = async () => {
  if (loading.value || !input.value.trim()) return;
  results.value = [];
  loading.value = true;
  try {
    const res = await baiduTranslateMessage.sendMessage(input.value || "");
    if (res.succeed) {
      const validName = toValidVariableName(res.data || "");
      results.value = [
        {
          pascalCase: kebabToCamelCase(validName, true),
          camelCase: kebabToCamelCase(validName),
          kebabCase: camelToKebabCase(validName)
        }
      ];
    } else {
      ElMessage({
        type: "error",
        message: res.msg || "翻译失败"
      });
    }
  } catch (err) {
    console.error("Translation error:", err);
    ElMessage({
      type: "error",
      message: String(err)
    });
  } finally {
    loading.value = false;
  }
};

const handleCodeItem = async (code: string) => {
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

// Lifecycle
onMounted(async () => {
  const { genVarNameInput = "" } = (await genVarNameLocalStorage.get()) || {};
  input.value = genVarNameInput;
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
