<template>
  <div class="mp-release-plan">
    <div class="control">
      <ElInput v-model="mpAppIdInput" placeholder="请输入小程序AppId" clearable @keyup.enter="handleAddMp" />
      <ElButton @click="handleAddMp">添加</ElButton>
    </div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in mpList" :key="index">
        <div class="left">
          <ElImage v-if="item.headimg" :src="item.headimg" class="headimg" />
          <div class="info">
            <span v-if="item.name">{{ item.name }}</span>
            <span>{{ item.appId }} {{ item.username ? `(${item.username})` : "" }}</span>
          </div>
        </div>
        <ElButton type="primary" @click="handleFinishMp(index)">已发版</ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElButton, ElImage } from "element-plus";
import { weixinLocalStorage } from "@taozi-chrome-extensions/common/src/local/weixin";
import type { WeixinLocalStorage } from "@taozi-chrome-extensions/common/src/local/weixin";

const mpList = ref<Required<WeixinLocalStorage>["mpReleasePlanList"]>([]);
const mpAppIdInput = ref("");

watch(
  mpList,
  () => {
    console.log("watch", mpList.value);
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
    .split(",")
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
.mp-release-plan {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .control {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      gap: 4px;

      .headimg {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        span {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>
