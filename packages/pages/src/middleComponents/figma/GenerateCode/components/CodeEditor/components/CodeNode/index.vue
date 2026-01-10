<template>
  <div class="code-node" :class="{ active: isActive }" @click.stop="handleClick">
    <!-- div -->
    <template v-if="isDivCon(con)">
      <div
        class="code-node-tag div-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <img
          src="@/assets/down-arrow.png"
          alt="div"
          :class="['down-arrow-icon', { expansion: con.config.expansionChildrenNodeTree }]"
          @click="handleExpansion"
        />
        <img v-if="con.config.disabled" src="@/assets/disabled.png" alt="" class="disabled-icon" />
        <span>{{ `\<${con.config.customComName || con.config.tagName}` }}</span>
        <!-- 显示背景颜色和字体颜色 -->
        <Color :con="con" />
        <span class="tag-prop">{{ ` class="${con.classNames.join(" ")}"` }}</span>
        <span>{{ `\>` }}</span>
        <!-- 显示更多操作 -->
        <template v-if="!con.config.expansionChildrenNodeTree">
          <div class="more-icon" @click="handleExpansion">...</div>
          <span>{{ `\</${con.config.customComName || con.config.tagName}\>` }}</span>
        </template>
      </div>
      <div v-if="con.config.expansionChildrenNodeTree" class="code-node-children">
        <div
          v-if="isActive"
          class="code-node-children-line"
          :style="{
            paddingLeft: indent * Retract + 'px'
          }"
        ></div>
        <!-- 子节点 -->
        <slot />
      </div>
      <div
        v-if="con.config.expansionChildrenNodeTree"
        class="code-node-tag div-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <div class="down-arrow-icon"></div>
        <span>{{ `\</${con.config.customComName || con.config.tagName}\>` }}</span>
      </div>
    </template>
    <!-- 图片 -->
    <template v-else-if="isImageCon(con)">
      <div
        class="code-node-tag img-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <img v-if="con.config.disabled" src="@/assets/disabled.png" alt="" class="disabled-icon" />
        <span>{{ `\<${con.config.customComName || con.config.tagName}` }}</span>
        <img v-if="con.config.src" :src="con.config.src" alt="image" class="image-icon" />
        <span class="tag-prop">{{ `class="${con.classNames.join(" ")}"` }}</span>
        <span>{{ `\/\>` }}</span>
      </div>
    </template>
    <!-- 文字 -->
    <template v-else-if="isSpanCon(con)">
      <div
        class="code-node-tag span-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <img
          src="@/assets/down-arrow.png"
          alt="div"
          :class="['down-arrow-icon', { expansion: con.config.expansionChildrenNodeTree }]"
          @click="handleExpansion"
        />
        <img v-if="con.config.disabled" src="@/assets/disabled.png" alt="" class="disabled-icon" />
        <span>{{ `\<${con.config.customComName || con.config.tagName}\>` }}</span>
        <!-- 显示字体颜色 -->
        <Color :con="con" />
        <span class="tag-prop">{{ `class="${con.classNames.join(" ")}"` }}</span>
        <span>{{ `\>` }}</span>
        <!-- 显示更多操作 -->
        <template v-if="!con.config.expansionChildrenNodeTree">
          <div class="more-icon" @click="handleExpansion">...</div>
          <span>{{ `\</${con.config.customComName || con.config.tagName}\>` }}</span>
        </template>
      </div>
      <div
        v-if="con.config.expansionChildrenNodeTree"
        class="code-node-text"
        :style="{
          paddingLeft: (indent + 1) * Retract + 'px'
        }"
      >
        <div
          v-if="isActive"
          class="code-node-children-line"
          :style="{
            paddingLeft: indent * Retract + 'px'
          }"
        ></div>
        <span>{{ con.config.text }}</span>
      </div>
      <div
        v-if="con.config.expansionChildrenNodeTree"
        class="code-node-tag span-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <div class="down-arrow-icon"></div>
        <span>{{ `\</${con.config.customComName || con.config.tagName}\>` }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BaseCon, isDivCon, isImageCon, isSpanCon } from "../../controller";
import Color from "./components/Color/index.vue";

const Retract = 16;

const props = withDefaults(
  defineProps<{
    con: BaseCon;
    indent?: number;
    activeConKey?: string;
  }>(),
  {
    indent: 0,
    activeConKey: ""
  }
);

const emit = defineEmits<{
  (e: "click", con: BaseCon): void;
}>();

const isActive = computed(() => {
  return props.activeConKey === props.con.key;
});

const handleClick = () => {
  emit("click", props.con);
};

const handleExpansion = () => {
  props.con.config.expansionChildrenNodeTree = !props.con.config.expansionChildrenNodeTree;
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
