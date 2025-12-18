<template>
  <ElDialog v-model="showCodesDialog" title="代码" width="50%">
    <ElForm :model="{}" :rules="{}" label-width="auto" :show-message="false" label-suffix=":">
      <ElFormItem label-position="left" label="组件名称">
        <span>{{ componentName }}</span>
        <ElButton @click="handlePasteComponentName" :loading="pasteComponentNameLoading">粘贴</ElButton>
        <ElButton @click="handleTranslateComponentName" :loading="translateComponentNameLoading">翻译</ElButton>
      </ElFormItem>
    </ElForm>
    <div v-if="showHtmlCode" class="html">
      <Code :code="showHtmlCode" :type="CodeType.Vue" />
    </div>
    <div v-if="showCssCode" class="css">
      <Code :code="showCssCode" :type="CodeType.Vue" />
    </div>
    <div v-if="showJsCode" class="js">
      <Code :code="showJsCode" :type="CodeType.Vue" />
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, ElMessage, ElButton } from "element-plus";
import { computed, ref, watch } from "vue";
import { CodeType } from "../../../../../components/Code";
import Code from "../../../../../components/Code/index.vue";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local/figma";
import { sendMessage } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { handleHtmlCode, handleCssCode } from "./index";

const showCodesDialog = ref(false);

const componentName = ref("");

watch([componentName], () => {
  figmaLocalStorage.edit((v) => {
    v.componentName = componentName.value;
  });
});

const codes = ref<{ title: string; lang: string; content: string }[]>([]);

const showHtmlCode = computed(() => {
  return handleHtmlCode(componentName.value, codes.value.find((code) => code.title === "index.html")?.content || "");
});
const showCssCode = computed(() => {
  return handleCssCode(componentName.value, codes.value.find((code) => code.title === "index.css")?.content || "");
});
const showJsCode = computed(() => {
  return "";
});

const pasteComponentNameLoading = ref(false);
const handlePasteComponentName = async () => {
  try {
    pasteComponentNameLoading.value = true;
    const text = await navigator.clipboard.readText();
    componentName.value = text;
  } catch (error) {
    console.error("粘贴组件名称失败", error);
  } finally {
    pasteComponentNameLoading.value = false;
  }
};

const translateComponentNameLoading = ref(false);
const handleTranslateComponentName = async () => {
  translateComponentNameLoading.value = true;
  try {
    const res = await sendMessage<string>({
      type: MessageType.BaiduTranslate,
      value: componentName.value,
    });
    if (res) {
      componentName.value = toValidVariableName(res);
    }
  } catch (error) {
    console.error("翻译组件名称失败", error);
    ElMessage({
      message: String(error),
      type: "error",
    });
  } finally {
    translateComponentNameLoading.value = false;
  }
};

const handleShowCodesDialog = async (codesData: { title: string; lang: string; content: string }[]) => {
  showCodesDialog.value = true;
  codes.value = codesData;

  const { componentName: componentName_ = "com" } = (await figmaLocalStorage.get()) || {};

  componentName.value = componentName_;
};

defineExpose({
  handleShowCodesDialog,
});
</script>
