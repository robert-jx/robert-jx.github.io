---
title: js-解决跨页选择后对数据判断的问题
date: '2023-05-12'
summary: ''
draft: false
tags: ['javascript']
canonicalUrl: ''
---

#### 前提

使用 `ant-design-vue` 的 `table` 表格组件，当前 `listData` 是只存储了当前页的数据，跨页时会重新请求数据并覆盖。

#### 问题

跨页选择数据后跳转新页面前要对勾选的数据进行判断，而 `table` 自带的勾选只能勾选当前行数据的 `key` 值，如何在 `listData` 不断变化的情况下判断 `key` 值对应的数据的某个属性？

#### 思路

在勾选的时候进行判断，并存储对应的数据至 `checkList` 数组里面，在跳页面前循环遍历 `checkList` 数组的某个属性进行判断即可。

好处：避免多次请求同一个分页接口

坏处：前端要进行数据处理

#### 实现

```html
<a-table
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    :columns="columns"
    :data-source="listData"
    :pagination="false"
    :locale="locale"
></table>
```

```js
onSelectChange(value) {
    //listData:当前分页的数据
    //checkList:通过勾选获取的id，存储勾选数据的详情
    //selectedRowKeys:存储勾选获取的key数组
    //value:获取勾选后的key数组
  if (value?.length > this.selectedRowKeys?.length) {
    value?.forEach(v => {
      let obj = this.listData.find((item) => item.id == v);
      if (obj && !this.checkList.find((item) => item.id == v)) {
        this.checkList.push(obj)
      }
    })
  }
  else if (value?.length == 0) this.checkList = [];
  else if (value?.length < this.selectedRowKeys?.length) {
    let list = this.selectedRowKeys.filter(item => {
      return value.indexOf(item) === -1
    });
    console.log(list);
    let finalArr = this.checkList.filter((item) => !list.includes(item.id));
    this.checkList = finalArr;
  }
  this.selectedRowKeys = value
},
```