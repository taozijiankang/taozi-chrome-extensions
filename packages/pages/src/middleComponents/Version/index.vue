<template>
  <div class="version-info">
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem label="version">
        {{ PACKAGE_JSON.version }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<script lang="ts" setup>
import { ElDescriptions, ElDescriptionsItem } from "element-plus";

const PACKAGE_JSON = __PACKAGE_JSON__;
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
