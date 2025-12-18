<template>
  <div class="dialog-content">
    <ElButton @click="getFigmaAssets">获取figma资源</ElButton>

    <ElForm :model="{}" :rules="{}" label-width="auto" :show-message="false" label-suffix=":">
      <ElFormItem label-position="left" label="组件名称">
        <Input v-model:value="componentName" />
      </ElFormItem>
    </ElForm>
    <ElTabs v-model="activeTableType" class="demo-tabs">
      <ElTabPane label="Code" :name="TableType.Code">
        <div class="codes">
          <div class="title">
            <div class="left"></div>
            <span>HTML</span>
          </div>
          <div v-if="showBaseCode.html" class="html">
            <Code :code="showBaseCode.html" :type="CodeType.Vue" />
          </div>
          <div class="title">
            <div class="left"></div>
            <span>CSS</span>
          </div>
          <div v-if="showBaseCode.css" class="css">
            <Code :code="showBaseCode.css" :type="CodeType.Css" />
          </div>
          <div class="title">
            <div class="left"></div>
            <span>JS</span>
          </div>
          <div v-if="showJsCode" class="js">
            <Code :code="showJsCode" :type="CodeType.Js" />
          </div>
        </div>
      </ElTabPane>
      <ElTabPane label="Assets" :name="TableType.Assets">
        <div class="assets">
          <div class="controller">
            <ElButton type="primary" @click="handleUploadAllAssets">全部上传</ElButton>
          </div>
          <div v-for="value in showAssets.filter(item => item.assets.length > 0)" :key="value.type" class="assets-container">
            <div class="title">
              <div class="left"></div>
              <span>{{ value.type }}</span>
            </div>
            <div class="asset-item" v-for="asset in value.assets" :key="asset.src">
              <img class="image" :src="asset.src" alt="asset" />
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
                  <Code :code="getAssetsJsCode({ name: asset.cuName, url: asset.ossUrl || asset.src })" :type="CodeType.Js" />
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
import { getAssetsJsCode, handleBaseCode } from "./index";
import type { Asset, BaseCode } from "./types";
import Input from "./components/input/index.vue";
import { sendMessage } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";

enum TableType {
  Code = "code",
  Assets = "assets"
}

const activeTableType = ref(TableType.Code);

const showCodesDialog = ref(false);

const componentName = ref("");

const codes = ref<BaseCode[]>([]);

const assets = ref<(Asset & { cuName: string; ossUrl: string })[]>([]);

const showBaseCode = ref<{
  html: string;
  css: string;
}>({
  html: "",
  css: ""
});

const showJsCode = computed(() => {
  return assets.value
    .map(item => {
      return getAssetsJsCode({ name: item.cuName, url: item.ossUrl || item.src });
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

watch([componentName, assets], () => {
  figmaLocalStorage.edit(v => {
    v.componentName = componentName.value;

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
  const { html, css } = await handleBaseCode(componentName.value, codes.value);

  const uniVueCode = html.replace(/(?<=<\/?)div/g, "view");

  showBaseCode.value = {
    html: uniVueCode,
    css
  };
};

const uploadAssetLoading = ref(false);
const handleUploadAsset = async (asset: Asset) => {
  uploadAssetLoading.value = true;
  try {
    const res = await sendMessage<string>({
      type: MessageType.UploadAsset,
      value: {
        src: asset.src,
        isCompressed: false,
        width: asset.width,
        height: asset.height
      }
    });
    if (res) {
      const on = assets.value.find(item => item.src === asset.src);
      if (on) {
        on.ossUrl = res;
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
    const { codes: codesData, assets: assetsData } = (await sendMessage<{ codes: BaseCode[]; assets: Asset[] }>({
      type: MessageType.GetFigmaAssets
    })) || { codes: [], assets: [] };
    const { componentName: componentName_ = "com", assets: assets_ = [] } = (await figmaLocalStorage.get()) || {};

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

    componentName.value = componentName_;

    generateShowCode();
  } catch (error) {
    console.error("获取figma资源失败", error);
  } finally {
    getFigmaAssetsLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
