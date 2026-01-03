<template>
  <div class="mp-release-plan">
    <div class="control">
      <ElInput
        v-model="mpAppIdInput"
        class="mp-app-input"
        type="textarea"
        :rows="5"
        placeholder="请输入小程序AppId，多个AppId用逗号或换行符分隔"
        clearable
      />
      <ElButton class="add-btn" @click="handleAddMp" type="primary">添加</ElButton>
    </div>
    <ElTable :data="mpList" style="width: 100%" stripe>
      <ElTableColumn width="55" label="头像">
        <template #default="{ row }">
          <ElImage v-if="row.headimg" :src="row.headimg" class="headimg" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="appId" label="AppId" />
      <ElTableColumn prop="name" label="小程序名称" />
      <ElTableColumn prop="username" label="用户名" />
      <ElTableColumn label="操作">
        <template #default="{ row }">
          <ElButton type="success" @click="handleFinishMp(row.index)">已发版</ElButton>
        </template>
      </ElTableColumn>
      <template #empty>
        <ElEmpty description="暂无小程序待发版" :image-size="40" />
      </template>
    </ElTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElButton, ElImage, ElEmpty, ElTable, ElTableColumn } from "element-plus";
import { weixinLocalStorage, type WeixinLocalStorage } from "@taozi-chrome-extensions/common/src/local";

const mpList = ref<Required<WeixinLocalStorage>["mpReleasePlanList"]>([]);
const mpAppIdInput = ref("");

watch(
  mpList,
  () => {
    weixinLocalStorage.edit(v => {
      v.mpReleasePlanList = [...mpList.value];
    });
  },
  {
    deep: true
  }
);

const handleAddMp = () => {
  if (!mpAppIdInput.value) return;
  const addMpList = mpAppIdInput.value
    .trim()
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => ({
      appId: item,
      name: "",
      headimg: "",
      username: "",
      email: "",
      type: ""
    }));
  if (addMpList.length === 0) return;
  mpList.value.unshift(...addMpList.filter(item => !mpList.value.some(v => v.appId === item.appId)));
  mpAppIdInput.value = "";
};

const handleFinishMp = (index: number) => {
  mpList.value.splice(index, 1);
};

onMounted(async () => {
  const { mpReleasePlanList = [] } = (await weixinLocalStorage.get()) || {};
  mpList.value = mpReleasePlanList;
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
