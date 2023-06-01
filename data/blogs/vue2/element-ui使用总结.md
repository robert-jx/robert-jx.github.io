---
title: element-ui使用总结
date: '2023-06-01'
summary: 'element-ui安装使用及常见问题总结'
draft: false
tags: ['vue2','element-ui']
canonicalUrl: ''
---

最近项目主打使用 `element-ui`，于是抽空对这个组件库进行一些总结。

### 介绍

[`element-ui`](https://element.eleme.cn/#/zh-CN)，一套为开发者、设计师和产品经理准备的基于 `Vue 2.0` 的桌面端组件库。

### 安装与引入

#### 使用 npm 安装

```js-nolint
npm i element-ui -S
```

#### 完整引入

在 `main.js` 内输入以下内容

```js
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

至此，`element-ui` 就安装并引入成功了，以下是常见问题👇

### 常见问题

#### el-tree 默认勾选

```html
 <el-tree
       ref="tree"
       class="filter-tree"
       :data="menuTree"
       :props="defaultProps"
       show-checkbox
       default-expand-all
       :expand-on-click-node="false"
       :filter-node-method="filterNode"
       highlight-current
       node-key="id"
   />
```

代码中使用node-key=“id”，使得树按id来进行表示在获取默认值defaultKey后，这里的defaultKey是一个id数组，例：['1','2']调用setCheckedKeys，如下。即可实现默认勾选

```js
this.$nextTick(() => {
   this.$refs.tree.setCheckedKeys(this.defaultKey);
   this.$forceUpdate();//强制渲染
});
```

#### el-input-number 计数器限制只能输⼊数字

```html
 <el-input-number 
    v-model.trim="num" 
    :min="1" 
    :max="10" 
    label="描述文字" 
    size="mini"
    onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode))">
</el-input-number>
```

#### el-dialog 可拖拽效果

`el-dialog` 一般都是在固定位置展现，因项目需求，要实现让弹窗可以拖动的效果。所以这里记录一下：

首先在 `utils` 文件夹下创建 `drag` 文件夹，里面包含 `drag.js` 和 `directive.js`

`drag.js`

```js
/**
 * 拖拽移动
 * @param  {elementObjct} bar 鼠标点击控制拖拽的元素
 * @param {elementObjct}  target 移动的元素
 * @param {function}  callback 移动后的回调
 */
 export function startDrag(bar, target, callback) {
    var params = {
      top: 0,
      left: 0,
      currentX: 0,
      currentY: 0,
      flag: false,
      cWidth: 0,
      cHeight: 0,
      tWidth: 0,
      tHeight: 0
    };
  
    // 给拖动块添加样式
    bar.style.cursor = 'move';
  
    // 获取相关CSS属性
    // o是移动对象
    // var getCss = function (o, key) {
    //   return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
    // };
  
    bar.onmousedown = function (event) {
      // 按下时初始化params
      var e = event ? event : window.event;
      params = {
        top: target.offsetTop,
        left: target.offsetLeft,
        currentX: e.clientX,
        currentY: e.clientY,
        flag: true,
        cWidth: document.body.clientWidth,
        cHeight: document.body.clientHeight,
        tWidth: target.offsetWidth,
        tHeight: target.offsetHeight
      };
  
      // 给被拖动块初始化样式
      target.style.margin = 0;
      target.style.top = params.top + 'px';
      target.style.left = params.left + 'px';
  
      if (!event) {
        // 防止IE文字选中
        bar.onselectstart = function () {
          return false;
        }
      }
  
      document.onmousemove = function (event) {
        // 防止文字选中
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
  
        var e = event ? event : window.event;
        if (params.flag) {
          var nowX = e.clientX;
          var nowY = e.clientY;
          // 差异距离
          var disX = nowX - params.currentX;
          var disY = nowY - params.currentY;
          // 最终移动位置
          var zLeft = 0;
          var zTop = 0;
  
          zLeft = parseInt(params.left) + disX;
          // 限制X轴范围
          if (zLeft <= -parseInt(params.tWidth / 2)) {
            zLeft = -parseInt(params.tWidth / 2);
          }
          if (zLeft >= params.cWidth - parseInt(params.tWidth * 0.5)) {
            zLeft = params.cWidth - parseInt(params.tWidth * 0.5);
          }
  
          zTop = parseInt(params.top) + disY;
          // 限制Y轴范围
          if (zTop <= 0) {
            zTop = 0;
          }
          if (zTop >= params.cHeight - parseInt(params.tHeight * 0.5)) {
            zTop = params.cHeight - parseInt(params.tHeight * 0.5);
          }
  
          // 执行移动
          target.style.left = zLeft + 'px';
          target.style.top = zTop + 'px';
        }
  
        if (typeof callback == "function") {
          callback(zLeft, zTop);
        }
      }
  
      document.onmouseup = function () {
        params.flag = false;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

```

`directive.js`

```js
// 引入拖拽js
import { startDrag } from './drag.js'

/**
 * 为el-dialog弹框增加拖拽功能
 * @param {*} el 指定dom
 * @param {*} binding 绑定对象
 * desc   只要用到了el-dialog的组件，都可以通过增加v-draggable属性变为可拖拽的弹框
 */
const draggable = (el, binding) => {
    // 绑定拖拽事件 [绑定拖拽触发元素为弹框头部、拖拽移动元素为整个弹框]
    startDrag(el.querySelector('.el-dialog__header'), el.querySelector('.el-dialog'), binding.value);
};

const directives = {
    draggable,
};
// 这种写法可以批量注册指令
export default {
  install(Vue) {
      Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key]);
    });
  },
};

```

接着在 `main.js` 中引入

```js
/* 注册全局指令 --拖拽 */
import directive from "@/utils/drag/directive"
Vue.use(directive)
```

之后就可以在需要拖拽的 `el-dialog` 弹窗中使用 `v-draggable` 指令即可实现该效果

```html
<el-dialog
	v-draggable
	width="80%"
	@close="handleClose"
	:visible.sync="dialogVisible"
	:close-on-click-modal="false"
>
</el-dialog>
```
