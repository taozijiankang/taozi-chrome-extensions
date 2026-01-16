<template>
  <div class="figma-generate-code">
    <CodeEditor
      class="code-editor"
      :cons="consComputed"
      :active-node-tree-con-key="activeNodeTreeConKey"
      :codeType="codeType"
      @update:cons="handleUpdateCons"
      @update:active-node-tree-con-key="handleUpdateActiveNodeTreeConKey"
      @update:codeType="handleUpdateCodeType"
    />
  </div>
</template>

<script setup lang="ts">
import { figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import CodeEditor from "./components/CodeEditor/index.vue";
import { byFigmaAssetsGetCons } from "../utils/byFigmaAssetsGetCons";
import { BaseCon } from "./components/CodeEditor/controller";
import { ConGenCodeType } from "./components/CodeEditor/constants/enum";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local";
import { ConGenCodeTypeOptions } from "./components/CodeEditor/constants";
import { exportConfigs, findConById, findConByKey, importConfigs } from "./components/CodeEditor/utils";

const cons = ref<BaseCon[]>([]);

const activeNodeTreeConKey = ref("");

const codeType = ref(ConGenCodeType.Default);

const consComputed = computed(() => {
  return cons.value as BaseCon[];
});

watch(
  [cons, activeNodeTreeConKey, codeType],
  async () => {
    figmaLocalStorage.edit(v => {
      v.conConfigs = exportConfigs(cons.value as BaseCon[]);
      v.activeNodeTreeConId = findConByKey(cons.value as BaseCon[], activeNodeTreeConKey.value)?.config.id || "";
      v.codeEditorCodeType = codeType.value;
    });
  },
  {
    deep: true
  }
);

const handleUpdateCons = (cons_: BaseCon[]) => {
  cons.value = cons_;
};

const handleUpdateActiveNodeTreeConKey = (key: string) => {
  activeNodeTreeConKey.value = key;
};

const handleUpdateCodeType = (value: ConGenCodeType) => {
  codeType.value = value;
};

const figmaAssetsListener: Parameters<typeof figmaAssetsMessage.addListener>[0] = req => {
  try {
    if (req) {
      const con = byFigmaAssetsGetCons(req);
      if (con) {
        cons.value.unshift(con);
      }
    }
    return {
      result: true,
      getResponse: async () => {
        return {
          succeed: true,
          data: undefined
        };
      }
    };
  } catch (e) {
    console.error("获取con失败", e);
    return {
      result: true,
      getResponse: async () => {
        return {
          succeed: false,
          msg: String(e)
        };
      }
    };
  }
};

onMounted(async () => {
  figmaAssetsMessage.addListener(figmaAssetsListener);

  const {
    conConfigs = [],
    activeNodeTreeConId = "",
    codeEditorCodeType = ConGenCodeType.Default
  } = (await figmaLocalStorage.get()) || {};

  if (conConfigs) {
    cons.value = importConfigs(conConfigs);
  }
  if (activeNodeTreeConId) {
    activeNodeTreeConKey.value = findConById(cons.value as BaseCon[], activeNodeTreeConId)?.key || "";
  }
  if (codeEditorCodeType) {
    codeType.value = ConGenCodeTypeOptions.find(item => item.value === codeEditorCodeType)?.value || ConGenCodeType.Default;
  }
});

onUnmounted(() => {
  figmaAssetsMessage.removeListener(figmaAssetsListener);
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
