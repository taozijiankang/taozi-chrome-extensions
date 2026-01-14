<script setup lang="ts">
import Agent from "../../middleComponents/Agent/index.vue";
import Head from "../../middleComponents/Head/index.vue";
import ContentCard from "../../components/ContentCard/index.vue";
</script>

<template>
  <div class="agent-page">
    <div class="top">
      <div class="head">
        <Head title="Agent" />
      </div>
    </div>
    <div class="content-container">
      <ContentCard>
        <Agent />
      </ContentCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index.scss";
</style>
