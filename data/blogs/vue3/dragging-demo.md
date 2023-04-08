---
title: dragging-demo
date: '2023-04-08'
summary: >-
  基于vue3+vite+typescript的拖拽布点功能实现
draft: false
tags: ['vue3','typescript']
canonicalUrl: ''
---
### 拖拽布点功能

以前用过vue2来实现过拖拽布点的功能，最近研究了下vue3，写了个类似功能的demo，同样是基于dragStart等事件来实现。

该demo开箱即用，链接如下：

#### 项目链接
https://github.com/robert-jx/dragging-demo

#### 关键代码

这里的点位我只是用了文字来展示，可以改成自定义图标
```
<template>
  <section class="app">
    <section class="left">
      <section class="title">
        拖拽布点
      </section>
      <section class="left-content">
        <section class="left-item" v-for="(item, index) in leftList" :key="index" :draggable="true"
          @dragstart="(e) => { dragStart(e, true) }">
          {{ item.title }}
        </section>
      </section>
    </section>
    <section class="right" @dragover.prevent @drop="dragDrop">
      <section class="right-item" v-for="(item, index) in dragList" :key="index" :draggable="true"
        @dragstart="(e) => { dragStart(e, false) }" :style="{ top: item.y + 'px', left: item.x + 'px' }">
        {{ item.title }}
      </section>
    </section>
  </section>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus'

export interface Obj {
  id?: string,
  title?: string
  fromLeft?: boolean
}

const leftList = [
  { id: '1', title: '点位一' },
  { id: '2', title: '点位二' },
  { id: '3', title: '点位三' },
  { id: '4', title: '点位四' },
  { id: '5', title: '点位五' },
]
const dragList: any = reactive([])
let dragObj: Obj = {}
const dragStart = (e: any, fromLeft: boolean) => {
  let obj = leftList.find((item) => item.title == e.target.innerText)
  dragObj.title = obj?.title
  dragObj.id = obj?.id
  dragObj.fromLeft = fromLeft;
}
const dragDrop = (e: any) => {
  console.log(e);
  console.log('dragList', dragList);

  if (dragList.find((item: any) => dragObj.id == item.id) && dragObj.fromLeft) {
    ElMessage({
      message: '该点位已部署.',
      type: 'warning'
    })
  }
  else if (!dragList.find((item: any) => dragObj.id == item.id)) {
    console.log('dragObj', dragObj);
    dragList.push({
      id: dragObj.id,
      title: dragObj.title,
      fromLeft: false,
      x: e.offsetX,
      y: e.offsetY
    })
    dragObj = {};
  }
  else if (dragList.find((item: any) => dragObj.id == item.id) && dragObj.fromLeft == false) {
    dragList.forEach((v: any) => {
      if (v.id == dragObj.id) {
        v.x = e.offsetX
        v.y = e.offsetY
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;

  .left {

    width: 300px;
    height: 100%;
    border-right: 1px solid #fff;
    padding: 0 15px;
    box-sizing: border-box;

    .title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #fff;
      font-weight: 600;
    }

    .left-content {
      width: 100%;
      height: calc(100% - 50px);
      overflow-y: auto;

      .left-item {
        height: 50px;
        width: 100%;
        text-align: center;
        line-height: 50px;
        cursor: pointer;

        &:hover {
          background-color: #1f69ad;
        }
      }
    }
  }

  .right {
    position: relative;
    width: calc(100% - 300px);
    height: 100%;

    .right-item {
      position: absolute;
      width: auto;
      height: 50px;
      line-height: 50px;
      color: #fff;
      z-index: 500;
    }
  }
}
</style>

```