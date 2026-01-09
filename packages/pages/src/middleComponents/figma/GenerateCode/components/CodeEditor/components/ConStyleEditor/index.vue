<template>
  <div class="con-style-editor">
    <ContentCard title="元素样式" contentBackground="#f7f9fb">
      <div class="con-style-editor-content">
        <div class="con-style-editor-content-item" v-for="(item, index) in con.config.styleProps" :key="index">
          <ElCheckbox :modelValue="!item.disabled" @update:modelValue="handleDisabled(item)" />
          <ElInput v-model="item.property" clearable />
          <span>:</span>
          <ElInput v-model="item.value" clearable />
          <ElColorPicker
            v-if="item.property === 'color' || item.property === 'background-color'"
            v-model="item.value"
            show-alpha
          />
          <ElButton type="danger" :icon="Delete" circle @click="handleDeleteStyle(index)"></ElButton>
        </div>
        <ElButton type="primary" :icon="Plus" @click="handleAddStyle"> </ElButton>
      </div>
    </ContentCard>
  </div>
</template>

<script setup lang="ts">
import { BaseCon } from "../../controller";
import ContentCard from "@/components/ContentCard/index.vue";
import { ElInput, ElCheckbox, ElColorPicker, ElButton } from "element-plus";
import { Delete, Plus } from "@element-plus/icons-vue";

const props = defineProps<{
  con: BaseCon;
}>();

const handleDisabled = (item: { disabled?: boolean }) => {
  item.disabled = !item.disabled;
};

const handleValue = (item: { value: string }, value: string) => {
  console.log(item, "----", value);
  item.value = value;
};

const handleProperty = (item: { property: string }, value: string) => {
  console.log(item);
};

const handleAddStyle = () => {
  props.con.config.styleProps?.push({
    property: "",
    value: "",
    disabled: false
  });
};

const handleDeleteStyle = (index: number) => {
  props.con.config.styleProps?.splice(index, 1);
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
