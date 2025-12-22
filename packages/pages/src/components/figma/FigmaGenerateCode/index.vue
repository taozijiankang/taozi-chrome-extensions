<template>
  <div class="dialog-content">
    <ElButton type="primary" @click="getFigmaAssets">获取figma资源</ElButton>
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
        </div>
      </ElTabPane>
      <ElTabPane label="CSS" :name="TableType.Css">
        <div class="codes">
          <div v-if="showBaseCode.scss" class="scss">
            <Code :code="showBaseCode.scss.trim()" :type="CodeType.Css" />
          </div>
        </div>
      </ElTabPane>
      <ElTabPane label="JS" :name="TableType.Js">
        <div class="codes">
          <div v-if="showJsCode" class="js">
            <Code :code="showJsCode.trim()" :type="CodeType.Js" />
          </div>
        </div>
      </ElTabPane>
      <ElTabPane label="Assets" :name="TableType.Assets">
        <div class="assets">
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
                  <ElButton v-else type="primary" @click="handleUploadAsset(asset)" :loading="uploadAssetLoading">上传</ElButton>
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
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElForm, ElFormItem, ElTabs, ElTabPane, ElMessage } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";
import { CodeType } from "../../Code/index";
import Code from "../../Code/index.vue";
import { figmaLocalStorage } from "@taozi-chrome-extensions/common/src/local/figma";
import { getAssetsJsCode, handleBaseCode, toUniappCode } from "./index";
import type { Asset, BaseCode } from "./types";
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

const showCodesDialog = ref(false);

const componentName = ref("");

const codes = ref<BaseCode[]>([]);

const assets = ref<(Asset & { cuName: string; ossUrl: string })[]>([]);

const showBaseCode = ref<{
  html: string;
  scss: string;
}>({
  html: "",
  scss: ""
});

const showJsCode = computed(() => {
  return assets.value
    .map(item => {
      return getAssetsJsCode({ name: item.cuName, url: item.ossUrl || item.src, type: item.type });
    })
    .join("\n");
});

const imageAssets = computed(() => {
  return assets.value.filter(item => item.type === "image");
});

const iconAssets = computed(() => {
  return assets.value.filter(item => item.type === "icon");
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

watch([componentName, assets, activeTableType], () => {
  figmaLocalStorage.edit(v => {
    v.componentName = componentName.value;
    v.activeTab = activeTableType.value;
    v.assets = assets.value.map(item => {
      return {
        name: item.cuName,
        figmaDownloadUrl: item.src,
        ossUrl: item.ossUrl
      };
    });
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
const handleUploadAsset = async (asset: Asset) => {
  uploadAssetLoading.value = true;
  try {
    const res = await uploadAssetToOssMessage.sendMessage({
      src: asset.src,
      isCompressed: false,
      width: asset.width,
      height: asset.height
    });
    if (res.succeed) {
      const on = assets.value.find(item => item.src === asset.src);
      if (on) {
        on.ossUrl = res.data || "";
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

const handleUploadAllAssets = async () => {
  for (const asset of assets.value) {
    await handleUploadAsset(asset);
  }
};

const getFigmaAssetsLoading = ref(false);
const getFigmaAssets = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  // 检查是否在 Figma 页面
  if (!tab.url || !tab.url.includes("figma.com")) {
    ElMessage.error("请先打开 Figma 设计页面");
    return;
  }

  try {
    getFigmaAssetsLoading.value = true;
    const res = await figmaAssetsMessage.sendTabMessage(tab.id || 0);
    if (!res.succeed) {
      ElMessage.error(res.msg || "获取figma资源失败");
      return;
    }
    const { codes: codesData, assets: assetsData } = res.data || { codes: [], assets: [] };

    const { assets: assets_ = [] } = (await figmaLocalStorage.get()) || {};

    showCodesDialog.value = true;
    codes.value = codesData;

    assets.value = assetsData.map((item, index) => {
      const asset = assets_.find(asset => asset.figmaDownloadUrl === item.src);

      return {
        ...item,
        cuName: asset?.name || `${item.type}-${index}`,
        ossUrl: asset?.ossUrl || ""
      };
    });

    generateShowCode();
  } catch (error) {
    console.error("获取figma资源失败", error);
  } finally {
    getFigmaAssetsLoading.value = false;
  }
};

onMounted(async () => {
  const { componentName: componentName_ = "com", activeTab: activeTab_ = TableType.Html } = (await figmaLocalStorage.get()) || {};

  componentName.value = componentName_;

  activeTableType.value = activeTab_ as TableType;

  getFigmaAssets();
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
