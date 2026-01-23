<template>
  <div class="con-style-editor">
    <ContentCard title="元素样式" contentBackground="#f7f9fb">
      <div class="con-style-editor-content">
        <div class="con-style-editor-content-item" v-for="(item, index) in con.config.styleProps" :key="index">
          <ElCheckbox :modelValue="!item.disabled" @update:modelValue="handleDisabled(item)" />
          <ElAutocomplete v-model="item.property" clearable :fetch-suggestions="handlePropertySuggest" placeholder="CSS 属性" />
          <span>:</span>
          <ElAutocomplete
            v-model="item.value"
            clearable
            :fetch-suggestions="(query, cb) => handleValueSuggest(item.property, query, cb)"
            placeholder="属性值"
          />
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
import { ElCheckbox, ElColorPicker, ElButton, ElAutocomplete } from "element-plus";
import { Delete, Plus } from "@element-plus/icons-vue";
import { cssPropertyOptions, cssValueOptions } from "./index";
import { filter as fuzzyFilter } from "@taozi-chrome-extensions/common/src/utils/fuzzy";

const props = defineProps<{
  con: BaseCon;
}>();

const handleDisabled = (item: { disabled?: boolean }) => {
  item.disabled = !item.disabled;
};

const handlePropertySuggest = (queryString: string, cb: (arg: Array<{ value: string }>) => void) => {
  if (!queryString) {
    const list = cssPropertyOptions.map(value => ({ value }));
    cb(list);
    return;
  }
  const fuzzyResults = fuzzyFilter(queryString, cssPropertyOptions);
  const list = fuzzyResults.map(result => ({ value: result.original }));
  cb(list);
};

const handleValueSuggest = (property: string, queryString: string, cb: (arg: Array<{ value: string }>) => void) => {
  const baseValues = cssValueOptions[property as keyof typeof cssValueOptions] ?? ["inherit", "initial", "unset", "auto", "none"];
  if (!queryString) {
    const list = baseValues.map(value => ({ value }));
    cb(list);
    return;
  }
  const fuzzyResults = fuzzyFilter(queryString, baseValues);
  const list = fuzzyResults.map(result => ({ value: result.original }));
  cb(list);
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
