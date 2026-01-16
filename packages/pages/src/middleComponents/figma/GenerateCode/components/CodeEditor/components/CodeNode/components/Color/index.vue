<template>
  <div
    v-if="backgroundColor || fontColor || border"
    class="color"
    :style="{
      backgroundColor: backgroundColor,
      border: border
    }"
  >
    <div class="font-color" :style="{ backgroundColor: fontColor }"></div>
  </div>
</template>

<script setup lang="ts">
import type { BaseCon } from "../../../../controller";
import { computed } from "vue";

const props = defineProps<{
  con: BaseCon;
}>();

const backgroundColor = computed(() => {
  return props.con.config.styleProps?.find(item => item.property === "background-color")?.value;
});

const fontColor = computed(() => {
  return props.con.config.styleProps?.find(item => item.property === "color")?.value;
});

const border = computed(() => {
  return props.con.config.styleProps?.find(item => item.property === "border")?.value;
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
