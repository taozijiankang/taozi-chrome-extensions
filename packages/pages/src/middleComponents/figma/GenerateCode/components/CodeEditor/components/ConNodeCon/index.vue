<template>
  <div class="con-node-con">
    <TranslateInput v-model:value="con.props.name" />
  </div>
</template>

<script setup lang="ts">
import TranslateInput from "@/components/TranslateInput/index.vue";
import { BaseCon } from "../../controller";

const props = defineProps<{
  con: BaseCon;
}>();
</script>

<style lang="scss" scoped>
@use "./index";
</style>
