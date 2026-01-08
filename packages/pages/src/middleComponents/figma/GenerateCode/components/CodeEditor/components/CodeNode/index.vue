<template>
  <div class="code-node" :class="{ active: isActive }" @click.stop="handleClick">
    <!-- div -->
    <template v-if="isDivCon(con)">
      <div
        class="code-node-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <img src="@/assets/down-arrow.png" alt="div" :class="['down-arrow-icon', { expansion }]" @click="handleExpansion" />
        <span>{{ `\<${con.props.tagName}` }}</span>
        <span class="tag-prop">{{ ` class="${con.className}"` }}</span>
        <span>{{ `\>` }}</span>
        <template v-if="!expansion">
          <span class="more-icon" @click="handleExpansion">...</span>
          <span>{{ `\</${con.props.tagName}\>` }}</span>
        </template>
      </div>
      <div v-if="expansion" class="code-node-children">
        <div
          v-if="isActive"
          class="code-node-children-line"
          :style="{
            paddingLeft: indent * Retract + 'px'
          }"
        ></div>
        <slot />
      </div>
      <div
        v-if="expansion"
        class="code-node-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <div class="down-arrow-icon"></div>
        <span>{{ `\</${con.props.tagName}\>` }}</span>
      </div>
    </template>
    <!-- 图片 -->
    <template v-else-if="isImageCon(con)">
      <div
        class="code-node-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <span>{{ `\<${con.props.tagName}` }}</span>
        <span class="tag-prop">{{ ` class="${con.className}"` }}</span>
        <span>{{ `\/\>` }}</span>
      </div>
    </template>
    <!-- 文字 -->
    <template v-else-if="isSpanCon(con)">
      <div
        class="code-node-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <img src="@/assets/down-arrow.png" alt="div" :class="['down-arrow-icon', { expansion }]" @click="handleExpansion" />
        <span>{{ `\<${con.props.tagName} class="${con.className}"\>` }}</span>
        <template v-if="!expansion">
          <span class="more-icon" @click="handleExpansion">...</span>
          <span>{{ `\</${con.props.tagName}\>` }}</span>
        </template>
      </div>
      <div
        v-if="expansion"
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
        {{ con.props.text }}
      </div>
      <div
        v-if="expansion"
        class="code-node-tag"
        :style="{
          paddingLeft: indent * Retract + 'px'
        }"
      >
        <div class="down-arrow-icon"></div>
        <span>{{ `\</${con.props.tagName}\>` }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BaseCon, isDivCon, isImageCon, isSpanCon } from "../../controller";

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

const expansion = ref(false);

const isActive = computed(() => {
  return props.activeConKey === props.con.key;
});

const handleClick = () => {
  emit("click", props.con);
};

const handleExpansion = () => {
  expansion.value = !expansion.value;
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
