<template>
  <div class="code-editor">
    <div class="html-view" ref="htmlViewRef">
      <div
        v-if="activeConElementOffset"
        class="html-view-item-active-outline"
        :style="{
          left: activeConElementOffset?.x + 'px',
          top: activeConElementOffset?.y + 'px',
          width: activeConElementOffset?.width + 'px',
          height: activeConElementOffset?.height + 'px'
        }"
      ></div>
      <div class="content-container">
        <div
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
        </div>
      </div>
    </div>
    <div class="code-node-tree-view">
      <template v-if="activeCon">
        <Render
          :render="
            activeCon?.renderNodeTree.bind(activeCon, {
              indent: 0,
              activeConKey: activeNodeTreeConKey,
              click: handleNodeTreeConClick
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
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  cons: BaseCon[];
  imageAssets: string[];
}>();

const htmlViewRef = ref<HTMLDivElement>();

const activeConKey = ref<string>();

const activeNodeTreeConKey = ref<string>();

const activeConElementOffset = ref<{
  x: number;
  y: number;
  width: number;
  height: number;
} | null>(null);

const activeCon = computed(() => {
  return props.cons.find(con => con.key === activeConKey.value);
});

const activeCodeCon = computed(() => {
  const f = (list: BaseCon[]): BaseCon | undefined => {
    for (const con of list) {
      if (con.key === activeNodeTreeConKey.value) {
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

const handleNodeTreeConClick = (con: BaseCon) => {
  activeNodeTreeConKey.value = con.key;
};

const findNodeTreeConElement = () => {
  const key = activeNodeTreeConKey.value;
  if (!key) return;
  activeConElementOffset.value = null;
  const element = document.querySelector(`[data-key="${key}"]`);
  if (element) {
    const rect = element.getBoundingClientRect();
    const htmlViewRect = htmlViewRef.value?.getBoundingClientRect();
    if (htmlViewRect) {
      const offset = {
        x: rect.left - htmlViewRect.left,
        y: rect.top - htmlViewRect.top
      };
      activeConElementOffset.value = {
        x: offset.x,
        y: offset.y,
        width: rect.width,
        height: rect.height
      };
    }
  }
};

const findConElTimer = ref<ReturnType<typeof setInterval>>();

onMounted(() => {
  findConElTimer.value = setInterval(() => {
    findNodeTreeConElement();
  }, 100);
});

onUnmounted(() => {
  clearInterval(findConElTimer.value);
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
