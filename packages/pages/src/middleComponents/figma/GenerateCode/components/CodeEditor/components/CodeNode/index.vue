<template>
  <div class="code-node" @click.stop="handleClick">
    <template v-if="isDivCon(con)">
      <span class="code-node-tag">{{ `\<${con.props.tagName} class="${con.className}"\>` }}</span>
      <div class="code-node-children">
        <slot />
      </div>
      <span class="code-node-tag">{{ `\</${con.props.tagName}\>` }}</span>
    </template>
    <template v-else-if="isImageCon(con)">
      <span class="code-node-tag">{{
        `\<${con.props.tagName} class="${con.className}" src="${con.props.src}" alt="${con.props.alt}"\>`
      }}</span>
    </template>
    <template v-else-if="isSpanCon(con)">
      <span class="code-node-tag">{{ `\<${con.props.tagName} class="${con.className}"\>` }}</span>
      <span class="code-node-text">{{ con.props.text }}</span>
      <span class="code-node-tag">{{ `\</${con.props.tagName}\>` }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { BaseCon, isDivCon, isImageCon, isSpanCon } from "../../controller";

const emit = defineEmits<{
  (e: "click", con: BaseCon): void;
}>();

const props = withDefaults(
  defineProps<{
    con: BaseCon;
    indent?: number;
  }>(),
  {
    indent: 0
  }
);

const handleClick = () => {
  emit("click", props.con);
};
</script>

<style lang="scss" scoped>
@use "./index";
</style>
