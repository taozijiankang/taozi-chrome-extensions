<template>
  <div class="image-editor">
    <ContentCard title="uniapp-config" contentBackground="#f7f9fb">
      <ElForm labelSuffix=":" labelPosition="left">
        <ElFormItem label="图片裁剪、缩放的模式" labelPosition="top">
          <ElSelect v-model="con.uniappConfig.mode" clearable>
            <ElOption v-for="item in UniappImageModeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </ContentCard>
    <ContentCard title="图片" contentBackground="#f7f9fb">
      <ElForm labelSuffix=":" labelPosition="left">
        <ElFormItem label="图片地址" labelPosition="top">
          <ElInput v-model="con.config.src" clearable />
        </ElFormItem>
        <ElFormItem label="可用资源" labelPosition="top">
          <div class="image-assets-list">
            <div
              class="image-assets-list-item"
              v-for="imageAsset in imageAssets"
              :key="imageAsset"
              @click="handleUpdateImageAsset(imageAsset)"
            >
              <ElCheckbox :modelValue="imageAsset === con.config.src" />
              <img :src="imageAsset" />
            </div>
          </div>
        </ElFormItem>
      </ElForm>
    </ContentCard>
  </div>
</template>

<script setup lang="ts">
import ContentCard from "@/components/ContentCard/index.vue";
import { ElInput, ElCheckbox, ElSelect, ElOption, ElForm, ElFormItem } from "element-plus";
import { ImageCon } from "../../controller";
import { UniappImageModeTypeOptions } from "../../constants";

const props = defineProps<{
  con: ImageCon;
  imageAssets: string[];
}>();

const handleUpdateImageAsset = (imageAsset: string) => {
  props.con.config.src = imageAsset;
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
