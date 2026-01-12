<template>
  <div class="code-editor">
    <div class="html-view" ref="htmlViewRef">
      <div class="controller-container">
        <span>节点列表</span>
        <ElButton v-if="cons.length > 0" :type="editNodeList ? 'primary' : 'default'" @click="handleEditNodeList">
          {{ editNodeList ? "完成" : "编辑" }}
        </ElButton>
      </div>
      <div class="content-container">
        <div
          v-if="activeConElementOffset"
          class="ui-node-item-active-outline"
          :style="{
            left: activeConElementOffset?.x + 'px',
            top: activeConElementOffset?.y + 'px',
            width: activeConElementOffset?.width + 'px',
            height: activeConElementOffset?.height + 'px'
          }"
        ></div>
        <div
          v-if="cons.length > 0"
          class="ui-node-list-container"
          @mouseenter="handleHtmlViewMouseEnter"
          @mouseleave="handleHtmlViewMouseLeave"
        >
          <div v-for="(con, index) in cons" :key="con.key" class="ui-node-item-container">
            <div
              :class="[
                'content',
                {
                  active: activeConKey === con.key
                }
              ]"
              @click.stop="handleHtmlViewItemClick(con)"
            >
              <Render :render="con.renderHtml.bind(con)" />
            </div>
            <div v-if="editNodeList" class="controller">
              <!-- 上移 -->
              <ElButton
                class="button"
                type="primary"
                :icon="ArrowUp"
                circle
                :disabled="index === 0"
                @click="handleMoveUpHtmlViewItem(con)"
              ></ElButton>
              <!-- 删除 -->
              <ElButton class="button" type="danger" :icon="Delete" circle @click="handleDeleteHtmlViewItem(con)"></ElButton>
              <!-- 下移 -->
              <ElButton
                class="button"
                type="primary"
                :icon="ArrowDown"
                circle
                :disabled="index === cons.length - 1"
                @click="handleMoveDownHtmlViewItem(con)"
              ></ElButton>
            </div>
          </div>
        </div>
        <ElEmpty v-else description="请添加节点" />
      </div>
    </div>
    <div v-if="activeCon" class="code-node-tree-view">
      <div class="controller-container">
        <div class="select-element-icon-container" @click="handleSelectElement">
          <img v-if="selectElement" class="select-element-icon" src="@/assets/select-active.png" alt="" />
          <img v-else class="select-element-icon" src="@/assets/select.png" alt="" />
        </div>
      </div>
      <div class="content-container">
        <div class="content">
          <Render
            :render="
              activeCon?.renderNodeTree.bind(activeCon, {
                indent: 0,
                activeConKey: activeNodeTreeConKey,
                click: handleNodeTreeConClick
              })
            "
          />
        </div>
      </div>
    </div>
    <div v-if="activeNodeTreeCon" class="con-editor-view">
      <Render
        :render="
          activeNodeTreeCon.renderEditor.bind(activeNodeTreeCon, {
            imageAssets: imageAssets
          })
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseCon } from "./controller";
import { findConByKey, forEachCon } from "./utils";
import Render from "@/components/Render/index.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ElButton, ElMessageBox, ElEmpty } from "element-plus";
import { Delete, ArrowUp, ArrowDown } from "@element-plus/icons-vue";

const props = defineProps<{
  cons: BaseCon[];
  imageAssets: string[];
  activeNodeTreeConKey: string;
}>();

const emit = defineEmits<{
  (e: "update:cons", cons: BaseCon[]): void;
  (e: "update:activeNodeTreeConKey", key: string): void;
}>();

const htmlViewRef = ref<HTMLDivElement>();

const editNodeList = ref(false);

const activeConElementOffset = ref<{
  x: number;
  y: number;
  width: number;
  height: number;
} | null>(null);

const selectElement = ref(false);

const activeConKey = computed(() => {
  return (
    props.cons.find(con => {
      return !!findConByKey([con], props.activeNodeTreeConKey);
    })?.key || ""
  );
});

const activeCon = computed(() => {
  return props.cons.find(con => con.key === activeConKey.value);
});

const activeNodeTreeCon = computed(() => {
  return findConByKey(props.cons, props.activeNodeTreeConKey);
});

const handleEditNodeList = () => {
  editNodeList.value = !editNodeList.value;
};

const handleMoveUpHtmlViewItem = (con: BaseCon) => {
  const cons = [...props.cons];
  const index = cons.findIndex(c => c.key === con.key);
  if (index > 0) {
    const temp = cons[index - 1];
    cons[index - 1] = con;
    cons[index] = temp;
  }
  emit("update:cons", cons);
};

const handleMoveDownHtmlViewItem = (con: BaseCon) => {
  const cons = [...props.cons];
  const index = cons.findIndex(c => c.key === con.key);
  if (index < cons.length - 1) {
    const temp = cons[index + 1];
    cons[index + 1] = con;
    cons[index] = temp;
  }
  emit("update:cons", cons);
};

const handleDeleteHtmlViewItem = (con: BaseCon) => {
  ElMessageBox.alert("确定删除该节点吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      emit(
        "update:cons",
        props.cons.filter(c => c.key !== con.key)
      );
    })
    .catch(() => {
      return;
    });
};

const handleHtmlViewItemClick = (con: BaseCon) => {
  if (activeConKey.value !== con.key) {
    emit("update:activeNodeTreeConKey", con.key);
  }
};

const handleNodeTreeConClick = (con: BaseCon) => {
  emit("update:activeNodeTreeConKey", con.key);
};

const findNodeTreeConElement = () => {
  const key = props.activeNodeTreeConKey;
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
  const con = findConByKey(props.cons, key);
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
  emit("update:activeNodeTreeConKey", con.key);
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
