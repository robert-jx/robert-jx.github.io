---
title: fullscreen-demo
date: '2023-04-18'
summary: 实现全屏和非全屏的切换
draft: false
tags: ['vue3']
canonicalUrl: ''
---

#### 全屏效果

记录一个以前的需求，需要写一个工具箱然后里面支持放大缩小功能。单独把放大缩小功能记录一下。

这里使用的是document原生写法，其实还有其他选择，比如vue-fullscreen组件、fullscreen组件等

核心代码👇

```html
<template>
  <section class="fullscreen">
    <el-button type="primary" @click="firstMethod">全屏</el-button>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// 原生全屏
let isFullscreen = ref(false)
let element = document.documentElement;

const firstMethod = () => {
  // 判断是否已经是全屏
  // 如果是全屏，退出
  if (isFullscreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    console.log('已还原！');
  } else {    // 否则，进入全屏
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      // IE11
      element.msRequestFullscreen();
    }
    console.log('已全屏！');
  }
  // 改变当前全屏状态
  isFullscreen.value = !isFullscreen.value;
}
</script>


<style lang="scss" scoped>
.fullscreen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}
</style>

```

