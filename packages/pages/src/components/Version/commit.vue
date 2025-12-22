<template>
  <div class="commit">
    <ElDescriptions :column="1" border>
      <ElDescriptionsItem label="hash">
        {{ COMMIT_INFO.hash }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="author">
        {{ COMMIT_INFO.author }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="date">
        {{ dayjs(COMMIT_INFO.date).format("YYYY-MM-DD HH:mm:ss") }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="title">
        {{ COMMIT_INFO.title }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="message">
        {{ COMMIT_INFO.message }}
      </ElDescriptionsItem>
      <ElDescriptionsItem label="messageFull">
        {{ COMMIT_INFO.messageFull }}
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";

const COMMIT_INFO = __COMMIT_INFO__;
</script>

<style lang="scss" scoped></style>
