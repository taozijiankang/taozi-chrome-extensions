<template>
  <div class="content-card">
    <div class="title" v-if="title">
      <div class="left"></div>
      <span>{{ title }}</span>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: ""
  }
);
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
