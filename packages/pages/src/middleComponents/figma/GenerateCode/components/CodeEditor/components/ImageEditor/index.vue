<template>
  <div class="image-editor">
    <ContentCard title="图片" contentBackground="#f7f9fb">
      <div class="image-editor-content">
        <span>图片地址:</span>
        <ElInput v-model="con.config.src" clearable />
        <span>可用资源:</span>
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
      </div>
    </ContentCard>
  </div>
</template>

<script setup lang="ts">
import ContentCard from "@/components/ContentCard/index.vue";
import { ElInput, ElCheckbox } from "element-plus";
import { ImageCon } from "../../controller";

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
