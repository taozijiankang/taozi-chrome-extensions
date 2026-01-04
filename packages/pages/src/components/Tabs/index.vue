<template>
  <div class="tabs_" ref="tabsRef">
    <div
      v-for="item in list"
      :key="item.value"
      class="item"
      :class="{
        on: value === item.value
      }"
      @click="item.click ? item.click() : itemClick(item.value)"
    >
      <ElBadge :is-dot="item.alert">
        <span class="label" v-if="!item.slot">
          {{ item.label }}
        </span>
        <slot v-if="item.slot" :name="item.slot" :item="item" :on="value === item.value"> 插槽内容 </slot>
      </ElBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElBadge } from "element-plus";
import type { TabItem } from "./index";

const props = defineProps<{
  list: TabItem[];
  value: string;
}>();

const emit = defineEmits<{
  (e: "update:value", n: string): void;
  (e: "change", n: string): void;
}>();

const itemClick = (value: string) => {
  if (props.value === value) {
    return;
  }
  emit("update:value", value);
  emit("change", value);
};
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
