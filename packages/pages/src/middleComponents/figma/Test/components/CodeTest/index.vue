<template>
  <div class="frame-parent">
    <div class="frame-group">
      <div class="ellipse-parent">
        <img class="frame-child" :src="FrameChild" alt="" />
        <div class="wrapper">
          <span class="div"> 未绑定 </span>
        </div>
      </div>
      <div class="frame-container">
        <div class="frame-div">
          <div class="parent">
            <span class="div4"> 吴静 </span>
            <span class="div5"> 主任医师 </span>
          </div>
          <div class="rate-parent">
            <div class="rate">
              <div class="itemrate24">
                <img class="star-filled-icon" :src="StarFilledIcon" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="frame-parent2">
          <div class="wrapper2">
            <span class="div3"> 四川华西医院 </span>
          </div>
          <span class="div7"> 丨 </span>
          <div class="group">
            <span class="div8"> 内科 </span>
          </div>
        </div>
        <div class="frame-parent3">
          <div class="frame-wrapper">
            <div class="frame-parent4">
              <div class="wrapper3">
                <span class="div9"> 省级名中医 </span>
              </div>
              <div class="wrapper3">
                <span class="div9"> 推荐医生 </span>
              </div>
              <div class="wrapper3">
                <span class="div9"> 国务院特殊津贴 </span>
              </div>
            </div>
          </div>
          <div class="frame-item"></div>
        </div>
      </div>
    </div>
    <div class="wrapper6">
      <span class="div12">
        擅长: 新冠、艾滋病、梅毒、水痘、麻疹，猩红热，百日咳，布氏菌病，流行性出血热，结核病，伤寒，疟疾、疟疾、.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const FrameChild = `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f7ac90ba-91f3-4310-a33c-53c6f84afea9`;

const StarFilledIcon = `https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/25fe49a1-b38c-4b62-9980-83728dc263a8`;
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
