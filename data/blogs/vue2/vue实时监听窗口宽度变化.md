---
title: vue实时监听窗口宽度变化
date: '2023-05-06'
summary: ''
draft: false
tags: ['vue2']
canonicalUrl: ''
---

在使用echarts或者canvas的时候，难免要考虑到一个因素：【自适应】。当页面窗口发生变化的时候触发对应的渲染函数。那么该如何操作？

通过【监听窗口变化】可以达到大部分的【自适应】效果

### 有关原生js

```js
// 网页可见区域宽：
document.body.clientWidth
// 网页可见区域高：
document.body.clientHeight
// 网页可见区域宽：
document.body.offsetWidth (包括边线的宽)
// 网页可见区域高：
document.body.offsetHeight (包括边线的宽)
```

### 监听窗口变化

```js
window.onresize
```

### 在 mounted 内，挂载 window.onresize 方法

```js
mounted () {
    const that = this
    window.onresize = () => {
        return (() => {
            window.screenWidth = document.body.clientWidth
            that.screenWidth = window.screenWidth
        })()
    }
}
```

### 在 watch 中对 screenWidth 进行监听

```js
watch:{
    screenWidth(val){
        // 为了避免频繁触发 resize 函数导致页面卡顿，使用定时器
        if(!this.timer){
            // 一旦监听到的 screenWidth 值改变，就将其重新赋给 screenWidth，并触发对应的渲染函数
            this.screenWidth = val
            this.timer = true
            let that = this
            setTimeout(function(){
                // 打印 screenWidth 变化的值
                console.log(that.screenWidth)
                // 触发渲染函数
                that.render();
                that.timer = false
            },400)
        }
    }
}
```
