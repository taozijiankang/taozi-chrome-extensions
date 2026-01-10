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
      <div class="content-container" @mouseenter="handleHtmlViewMouseEnter" @mouseleave="handleHtmlViewMouseLeave">
        <div
          v-for="con in cons"
          :key="con.key"
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
      <div class="controller-container">
        <div class="select-element-icon-container" @click="handleSelectElement">
          <img v-if="selectElement" class="select-element-icon" src="@/assets/select-active.png" alt="" />
          <img v-else class="select-element-icon" src="@/assets/select.png" alt="" />
        </div>
      </div>
      <div class="node-tree-container">
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
    </div>
    <div class="con-editor-view">
      <template v-if="activeNodeTreeCon">
        <Render
          :render="
            activeNodeTreeCon.renderEditor.bind(activeNodeTreeCon, {
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
import { findConByKey, forEachCon } from "./utils";
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

const selectElement = ref(false);

const activeCon = computed(() => {
  return props.cons.find(con => con.key === activeConKey.value);
});

const activeNodeTreeCon = computed(() => {
  if (!activeNodeTreeConKey.value) return undefined;
  return findConByKey(props.cons, activeNodeTreeConKey.value);
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

const handleSelectElement = () => {
  selectElement.value = !selectElement.value;
};

const handleHtmlViewMouseEnter = () => {
  if (!selectElement.value) {
    return;
  }
  document.addEventListener("mousemove", handleHtmlViewMouseMove);
  document.addEventListener("mousedown", handleHtmlViewMousedown);
};
const handleHtmlViewMouseMove = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const key = target.dataset["key"];
  if (!key) {
    return;
  }
  const con = findConByKey([activeCon.value].filter(Boolean) as BaseCon[], key);
  if (!con) {
    return;
  }
  //闭合所有子节点
  forEachCon([con].filter(Boolean) as BaseCon[], con => {
    con.config.expansionChildrenNodeTree = false;
  });
  // 展开所有父节点
  let parentCon = con.parent?.();
  while (parentCon) {
    parentCon.config.expansionChildrenNodeTree = true;
    parentCon = parentCon.parent?.();
  }
  activeNodeTreeConKey.value = con.key;
};
const handleHtmlViewMousedown = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  selectElement.value = false;

  handleHtmlViewMouseLeave();
};
const handleHtmlViewMouseLeave = () => {
  document.removeEventListener("mousemove", handleHtmlViewMouseMove);
  document.removeEventListener("mousedown", handleHtmlViewMousedown);
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
