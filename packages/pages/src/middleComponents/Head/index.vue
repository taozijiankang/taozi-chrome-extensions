<template>
  <div class="head">
    <img src="../../assets/icon-128.png" alt="" />
    <span>{{ title || "taozi科技" }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<style lang="scss" scoped>
@use "./index";
</style>
