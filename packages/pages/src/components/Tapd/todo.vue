<template>
  <div class="tapd-todo">
    <ElTable class="workitem-list" :data="showWorkitemList" v-if="showWorkitemList && showWorkitemList.length > 0">
      <ElTableColumn prop="title" label="标题">
        <template #default="{ row }: { row: TapdWorkitem }">
          <div class="workitem-row">
            <ElTag
              style="margin-right: 6px"
              effect="dark"
              round
              :type="bugEntityTypeReg.test(row.entity_type) ? 'danger' : 'info'"
            >
              {{ row.entity_type.toLocaleUpperCase() }}
            </ElTag>
            <div class="workitem-title">
              <span class="workspace-name-span">{{ row.workspace_name }}</span>
              <span class="name-span" @click="openTab(row.detail_url)">{{ row.name }}</span>
            </div>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn width="100" label="待发版">
        <template #default="{ row }">
          <ElCheckbox
            v-if="bugEntityTypeReg.test(row.entity_type)"
            :model-value="tapdInfo?.toBeReleasedBugIds?.includes(row.short_id)"
            @change="handleBugToBeReleasedChange(row.short_id)"
          />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="priority_name" width="100" label="优先级" />
      <ElTableColumn prop="status_alias" width="100" label="状态" />
      <ElTableColumn prop="short_id" width="100" label="短id">
        <template #default="{ row }">
          <span class="short-id-span" @click="copyShortId(row.short_id)">{{ row.short_id }}</span>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElEmpty v-else description="暂无代办" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElTable, ElTableColumn, ElTag, ElLoading, ElEmpty, ElMessage, ElCheckbox } from "element-plus";
import { useTapdInfo } from "../../hooks/useTapdInfo";
import { tapdLocalStorage, type TapdWorkitem } from "@taozi-chrome-extensions/common/src/local/tapd";

const bugEntityTypeReg = /^bug$/i;

const { tapdInfo } = useTapdInfo();

const showWorkitemList = computed(() => {
  return (
    tapdInfo.value?.workitemList?.sort((a, b) => {
      return bugEntityTypeReg.test(a.entity_type) && !bugEntityTypeReg.test(b.entity_type) ? -1 : 0;
    }) || []
  );
});

const handleBugToBeReleasedChange = async (shortId: string) => {
  if (!tapdInfo.value) {
    return;
  }

  const { toBeReleasedBugIds = [] } = tapdInfo.value;
  const index = toBeReleasedBugIds.indexOf(shortId);
  if (index === -1) {
    toBeReleasedBugIds.push(shortId);
  } else {
    toBeReleasedBugIds.splice(index, 1);
  }
  tapdInfo.value.toBeReleasedBugIds = toBeReleasedBugIds;

  await tapdLocalStorage.edit(v => {
    v.toBeReleasedBugIds = [...toBeReleasedBugIds];
  });
};

const openTab = async (url: string) => {
  const loadingInstance = ElLoading.service({ fullscreen: true });
  try {
    url = await fetch(url).then(res => res.url);
    const [targetTab] = await chrome.tabs.query({
      url
    });
    if (targetTab) {
      chrome.tabs.update(targetTab.id!, { active: true });
    } else {
      chrome.tabs.create({ url });
    }
  } finally {
    loadingInstance.close();
  }
};

const copyShortId = async (shortId: string) => {
  navigator.clipboard
    .writeText(shortId)
    .then(() => {
      ElMessage({
        message: "复制成功",
        type: "success"
      });
    })
    .catch(() => {
      ElMessage({
        message: "复制失败",
        type: "error"
      });
    });
};
</script>

<style lang="scss" scoped>
.tapd-todo {
  display: flex;
  flex-direction: column;
  .workitem-list {
    .workitem-row {
      display: flex;
      align-items: center;
      .workitem-title {
        display: flex;
        flex-direction: column;
        .workspace-name-span {
          color: #999;
          font-weight: bold;
        }
        .name-span {
          cursor: pointer;
          &:hover {
            color: #409eff;
            text-decoration: underline;
          }
        }
      }
    }
    .short-id-span {
      cursor: pointer;
      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }
  }
}
</style>
