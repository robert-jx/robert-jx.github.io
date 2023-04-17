---
title: progress-bar
date: '2023-04-17'
summary: 基于vue3的进度条效果实现
draft: false
tags: ['vue3','scss']
canonicalUrl: ''
---

### 进度条效果实现

需求如下：点击按钮后发送请求，然后展现出自定义的进度条。考虑到颜色上要自定义，决定自己写，放弃使用组件。

该demo仅实现进度条的实现，效果图如下👇

![image](https://robert-jx.oss-cn-shenzhen.aliyuncs.com/blog/vue/progress-bar.png)

#### demo链接如下👇

https://github.com/robert-jx/progress-bar

#### 核心代码

```html
<template>
  <section class="progress-bar-view">
    <el-button v-if="isShowButton" type="primary" @click="startCheck">开始检测</el-button>
    <section v-else class="progress-bar">
      <div id="bar" class="progress" :style="{ width: `${progress}%` }"></div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
let isShowButton = ref(true)
let progress = ref(0)
let bar = ref()
onMounted(() => {
  bar.value = document.getElementById("bar")
})
const startCheck = () => {
  progress.value = 0;
  isShowButton.value = false;
  nextTick(() => {
    bar.value.style.width = 0 + "px";
  })
  startAnimation();
}
const startAnimation = () => {
  let intervalObj = setInterval(() => {
    if (progress.value >= 98) {
      clearInterval(intervalObj);
      progress.value = 100;
      isShowButton.value = true
    } else {
      progress.value++
    }
  }, 100);
}
</script>

<style lang="scss" scoped>
.progress-bar-view {
  width: 100%;
  height: 100%;

  .progress-bar {
    position: relative;
    overflow: hidden;
    width: 300px;
    height: 30px;
    background: rgba(20, 21, 23, 0.8);
    border-radius: 15px;
    border: 1px solid #0E0E0E;

    &::before {
      position: absolute;
      display: block;
      content: '检测中';
      width: 65px;
      height: 12px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      font-size: 12px;
      line-height: 12px;
      font-weight: 400;
      color: #FFFFFF;
    }
  }

  .progress {
    height: 100%;
    background-image: linear-gradient(90deg, #009A39, #189099, #5aa9dd, #fff);
    border-radius: 15px;
    transition: width 0.01s ease-in-out;
  }

}
</style>

```