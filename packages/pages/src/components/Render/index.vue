<script lang="ts" setup>
import { type VNode } from "vue";

const props = defineProps<{
  render: () => VNode;
}>();

const RenderComponent = () => props.render();
</script>

<template>
  <!-- 使用 component :is 渲染组件 -->
  <component :is="RenderComponent" />
</template>
