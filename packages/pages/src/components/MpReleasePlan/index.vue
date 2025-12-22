<template>
  <div class="mp-release-plan">
    <div class="control">
      <ElInput
        v-model="mpAppIdInput"
        type="textarea"
        :rows="5"
        placeholder="请输入小程序AppId，多个AppId用逗号或换行符分隔"
        clearable
      />
      <ElButton @click="handleAddMp" type="primary">添加</ElButton>
    </div>
    <div v-if="mpList.length > 0" class="list">
      <div class="list-item" v-for="(item, index) in mpList" :key="index">
        <div class="left">
          <ElImage v-if="item.headimg" :src="item.headimg" class="headimg" />
          <div class="info">
            <span v-if="item.name">{{ item.name }}</span>
            <span>{{ item.appId }} {{ item.username ? `(${item.username})` : "" }}</span>
          </div>
        </div>
        <ElButton type="success" @click="handleFinishMp(index)">已发版</ElButton>
      </div>
    </div>
    <ElEmpty v-else description="暂无小程序待发版" :image-size="40" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElButton, ElImage, ElEmpty } from "element-plus";
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
.mp-release-plan {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .control {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 12px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .list-item:last-child {
      border-bottom: none;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: space-between;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 12px;

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
}
</style>
