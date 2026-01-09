<template>
  <div class="code-editor">
    <div class="html-view">
      <view
        v-for="con in cons"
        :key="con.className"
        :class="[
          'html-view-item',
          {
            active: activeConKey === con.key
          }
        ]"
        @click="handleClickCon(con)"
      >
        <Render :render="con.renderHtml.bind(con)" />
      </view>
    </div>
    <div class="code-node-tree-view">
      <template v-if="activeCon">
        <Render
          :render="
            activeCon?.renderNodeTree.bind(activeCon, {
              indent: 0,
              activeConKey: activeCodeConKey,
              click: handleConCodeClick
            })
          "
        />
      </template>
    </div>
    <div class="con-editor-view">
      <template v-if="activeCodeCon">
        <Render
          :render="
            activeCodeCon.renderEditor.bind(activeCodeCon, {
              imageAssets: imageAssets
            })
          "
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseCon } from "./controller";
import Render from "@/components/Render/index.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  cons: BaseCon[];
  imageAssets: string[];
}>();

const activeConKey = ref<string>();

const activeCodeConKey = ref<string>();

const activeCon = computed(() => {
  return props.cons.find(con => con.key === activeConKey.value);
});

const activeCodeCon = computed(() => {
  const f = (list: BaseCon[]): BaseCon | undefined => {
    for (const con of list) {
      if (con.key === activeCodeConKey.value) {
        return con;
      }
      if (con.children) {
        const result = f(con.children);
        if (result) return result;
      }
    }
  };
  return f(props.cons);
});

const handleClickCon = (con: BaseCon) => {
  activeConKey.value = con.key;
};

const handleConCodeClick = (con: BaseCon) => {
  activeCodeConKey.value = con.key;
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
