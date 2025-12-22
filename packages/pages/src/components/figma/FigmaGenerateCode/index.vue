<template>
  <div class="dialog-content">
    <ElButton type="primary" @click="getFigmaAssets" :loading="getFigmaAssetsLoading">获取figma资源</ElButton>
    <ElAlert v-if="getFigmaAssetsErrorAlert" :closable="false" :title="getFigmaAssetsErrorAlert" type="error" />
    <ElSkeleton v-else-if="getFigmaAssetsLoading" :rows="4" animated />
    <template v-else>
      <div class="com-name">
        <span>组件名称:</span>
        <Input v-model:value="componentName" />
      </div>
      <ElTabs type="card" v-model="activeTableType" class="demo-tabs">
        <ElTabPane label="HTML" :name="TableType.Html">
          <div class="codes">
            <div v-if="showBaseCode.html" class="html">
              <Code :code="showBaseCode.html.trim()" :type="CodeType.Vue" />
            </div>
            <ElEmpty v-else description="暂无代码" :image-size="40" />
          </div>
        </ElTabPane>
        <ElTabPane label="CSS" :name="TableType.Css">
          <div class="codes">
            <div v-if="showBaseCode.scss" class="scss">
              <Code :code="showBaseCode.scss.trim()" :type="CodeType.Css" />
            </div>
            <ElEmpty v-else description="暂无代码" :image-size="40" />
          </div>
        </ElTabPane>
        <ElTabPane label="JS" :name="TableType.Js">
          <div class="codes">
            <div v-if="showJsCode" class="js">
              <Code :code="showJsCode.trim()" :type="CodeType.Js" />
            </div>
            <ElEmpty v-else description="暂无代码" :image-size="40" />
          </div>
        </ElTabPane>
        <ElTabPane label="Assets" :name="TableType.Assets">
          <div v-if="showAssets.some(item => item.assets.length > 0)" class="assets">
            <div class="controller">
              <ElButton class="button" type="primary" @click="handleUploadAllAssets">全部上传</ElButton>
            </div>
            <div v-for="value in showAssets.filter(item => item.assets.length > 0)" :key="value.type" class="assets-container">
              <div class="title">
                <div class="left"></div>
                <span>{{ value.type }}</span>
              </div>
              <div class="asset-item" v-for="asset in value.assets" :key="asset.src">
                <div class="image-container">
                  <img class="image" :src="asset.src" alt="asset" />
                </div>
                <div class="details">
                  <div class="cu-name">
                    <span>名字：</span>
                    <Input class="input" v-model:value="asset.cuName" />
                  </div>
                  <span class="name">{{ asset.name }} ({{ asset.width }}*{{ asset.height }})</span>
                  <div class="oss-url">
                    <span>{{ asset.ossUrl }}</span>
                    <ElButton v-if="asset.ossUrl" type="success" @click="handleCopyOssUrl(asset.ossUrl || '')">复制</ElButton>
                    <ElButton v-else type="primary" @click="handleUploadAsset(asset)" :loading="uploadAssetLoading"
                      >上传</ElButton
                    >
                  </div>
                  <div v-if="asset.ossUrl" class="js-code">
                    <Code
                      :code="getAssetsJsCode({ name: asset.cuName, url: asset.ossUrl || asset.src, type: asset.type })"
                      :type="CodeType.Js"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ElEmpty v-else description="暂无资源" :image-size="40" />
        </ElTabPane>
      </ElTabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElTabs, ElTabPane, ElEmpty, ElAlert, ElSkeleton } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";
import { CodeType } from "../../Code/index";
import Code from "../../Code/index.vue";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local/figma";
import { getAssetsJsCode, handleBaseCode, toUniappCode } from "./index";
import type { BaseCode, FigmaNodeInfo } from "./types";
import Input from "./components/input/index.vue";
import { uploadAssetToOssMessage } from "@taozi-chrome-extensions/common/src/message";
import { figmaAssetsMessage } from "@taozi-chrome-extensions/common/src/message/content/FigmaMessage";

enum TableType {
  Html = "html",
  Css = "css",
  Js = "js",
  Assets = "assets"
}

const activeTableType = ref(TableType.Html);

const getFigmaAssetsErrorAlert = ref("");

const componentName = ref("");

const fileKey = ref("");
const nodeId = ref("");
const codes = ref<BaseCode[]>([]);

const showBaseCode = ref<{
  html: string;
  scss: string;
}>({
  html: "",
  scss: ""
});

const showJsCode = computed(() => {
  return "";
});

const imageAssets = computed(() => {
  return [];
});

const iconAssets = computed(() => {
  return [];
});

const showAssets = computed(() => {
  return [
    {
      type: "images",
      assets: imageAssets.value
    },
    {
      type: "icons",
      assets: iconAssets.value
    }
  ];
});

watch([componentName], () => {
  generateShowCode();
});

watch([componentName, activeTableType], () => {
  figmaLocalStorage.edit(v => {
    v.activeTab = activeTableType.value;
  });
});

const generateShowCode = async () => {
  let { html, scss } = await handleBaseCode(componentName.value, codes.value);

  ({ html, scss } = toUniappCode({ html, scss }));

  showBaseCode.value = {
    html,
    scss
  };
};

const uploadAssetLoading = ref(false);
const handleUploadAsset = async (nodeInfo: FigmaNodeInfo) => {
  uploadAssetLoading.value = true;
  try {
    const res = await uploadAssetToOssMessage.sendMessage({
      fileKey: fileKey.value,
      nodeId: nodeInfo.id,
      isCompressed: false,
      width: nodeInfo.absoluteBoundingBox.width,
      height: nodeInfo.absoluteBoundingBox.height
    });
    if (res.succeed) {
      const { nodeCuDataList = [] } = (await figmaLocalStorage.get()) || {};
      const onNode = nodeCuDataList.find(item => item.fileKey === fileKey.value && item.nodeId === nodeId.value);
      if (onNode) {
        onNode.ossUrl = res.data || "";
      } else {
        nodeCuDataList.push({
          fileKey: fileKey.value,
          nodeId: nodeId.value,
          name: "",
          ossUrl: res.data || ""
        });
      }
    }
  } catch (error) {
    console.error("上传资产失败", error);
  } finally {
    uploadAssetLoading.value = false;
  }
};

const handleCopyOssUrl = (ossUrl: string) => {
  navigator.clipboard.writeText(ossUrl);
};

const handleUploadAllAssets = async () => {};

const getFigmaAssetsLoading = ref(false);
const getFigmaAssets = async () => {
  getFigmaAssetsErrorAlert.value = "";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  // 检查是否在 Figma 页面
  if (!tab.url || !tab.url.includes("figma.com")) {
    getFigmaAssetsErrorAlert.value = "请先打开 Figma 设计页面";
    return;
  }

  try {
    getFigmaAssetsLoading.value = true;

    const res = await figmaAssetsMessage.sendTabMessage(tab.id || 0);
    if (!res.succeed) {
      getFigmaAssetsErrorAlert.value = res.msg || "获取figma资源失败";
      return;
    }
    const { fileKey, nodeId, codes: codesData } = res.data || { codes: [] };
    if (!fileKey || !nodeId) {
      getFigmaAssetsErrorAlert.value = "获取figma资源失败，fileKey或nodeId为空";
      return;
    }

    const { nodeCuDataList = [] } = (await figmaLocalStorage.get()) || {};

    componentName.value = nodeCuDataList.find(item => item.fileKey === fileKey && item.nodeId === nodeId)?.name || "";

    codes.value = codesData;

    generateShowCode();
  } catch (error) {
    getFigmaAssetsErrorAlert.value = "获取figma资源失败";
    console.error("获取figma资源失败", error);
  } finally {
    getFigmaAssetsLoading.value = false;
  }
};

onMounted(async () => {
  const { activeTab: activeTab_ = TableType.Html } = (await figmaLocalStorage.get()) || {};

  activeTableType.value = activeTab_ as TableType;

  getFigmaAssets();
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
