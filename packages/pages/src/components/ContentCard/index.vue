<template>
  <div class="content-card">
    <div class="title" v-if="title">
      <div class="left"></div>
      <ElBadge :is-dot="alert">
        <span>{{ title }}</span>
      </ElBadge>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElBadge } from "element-plus";

withDefaults(
  defineProps<{
    title?: string;
    alert?: boolean;
  }>(),
  {
    title: "",
    alert: false
  }
);
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
