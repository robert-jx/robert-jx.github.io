---
title: element-ui使用总结
date: '2023-06-01'
summary: 'element-ui安装使用及常见问题总结'
draft: false
tags: ['vue2','element-ui']
canonicalUrl: ''
---

最近项目主打使用 `element-ui`，于是抽空对这个组件库进行一些总结。

## 介绍

[`element-ui`](https://element.eleme.cn/#/zh-CN)，一套为开发者、设计师和产品经理准备的基于 `Vue 2.0` 的桌面端组件库。

## 安装与引入

### 使用 npm 安装

```js-nolint
npm i element-ui -S
```

### 完整引入

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

## 常见问题

### el-tree 默认勾选

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

### el-input-number 计数器限制只能输⼊数字

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

### el-dialog 可拖拽效果

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

### el-table 实现跨页多选数据

遇到个需求：如果在跨页的 `table` 表格中跨页选择数据。原本以为没法实现，但是通过查询资料发现，可以通过以下方式实现：

给 `el-table` 添加 `row-key` 属性

```html
<el-table
        :data="dataList"
        border
        :row-key="getRowKey"
        style="width: 100%"
        height="300px"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
</el-table>
```

上面中的 `row-key` 需要绑定一个唯一值，这里的实际情况是每一条数据中的 `id` 是唯一值，因此 `getRowKey` 函数如下：

```js
getRowKey(row) {
  return row.id;
}
```

接着在表格的多选框中添加 `:reserve-selection="true"` 即可实现跨页选择

```html
<el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
```

这里的 `handleSelectionChange` 方法如下：

```js
// table多选
handleSelectionChange(val) {
    this.multipleSelection = val;
},
```

### el-table fixed 设置固定列头部背景不透明

```scss
::v-deep .el-table__fixed-right{
    background-color: #fff !important;
}

::v-deep .el-table__fixed-right::before,
::v-deep .el-table__fixed::before {
        background-color: #fff;
        font-size: 12px !important;
    }

::v-deep .el-table__fixed,
::v-deep .el-table__fixed-left {
    background-color: #fff !important;
}
```

### el-time-picker 修改局部样式

el-time-picker 的样式最终是挂载在 body 里面的。也就是说，它与我们的子组件是并列关系，那么这时候需要如何修改子组件内的 el-time-picker 样式？

【正确做法】：可以在 element-ui 中看到 DateTimePicker 的 Attributes 中存在一个 popper-class 属性，官方介绍中可以利用它可以给 DateTimePicker 下拉框的设置类名。

```html
<el-time-picker
  v-model="form.startTime"
  type="datetime"
  value-format="HH:mm:ss"
  clearable
  size="mini"
  placeholder="选择上班时间"
  :default-time="'08:00:00'"
  popper-class="myDatePicker"
/>
```

注意此处没有添加 scoped 属性，所以全局生效，但是有类名限制，不会与其他类样式冲突。

```html
<style lang="scss">
.myDatePicker {
  .el-time-panel {
    border: 1px solid #e4e7ed !important;
  }
  .el-time-panel__content {
    background: #fff !important;
  }
  .el-time-panel__footer {
    border-top: 1px solid #e4e4e4;
    background: #fff !important;
    padding: 4px;
    height: 36px;
    line-height: 25px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-time-panel__footer .el-time-panel__btn {
    color: #606266 !important;
  }
  .el-time-panel__footer .el-time-panel__btn:hover {
    color: #606266 !important;
  }
}
</style>
```

### el-input 校验规则

这里收集了一些关于 `el-input` 的校验规则

使用例子：

```js
rules: {
  people: [
     //在未输入任何内容情况下触发
    { required: true, message: "请输入你的内容", trigger: "blur" },
     //在输入非数字或不是1-100之间的整数时触发
    {
      pattern: /^(?:0|[1-9][0-9]?|100)(\.[0-9]{0,2})?$/,
      message: "只能为0-100之间的整数",
    },
  ],
}
```

其他验证规则👇

```js
1、是否合法IP地址:
pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
 
2、是否手机号码或者固话:
pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
 
3. 是否身份证号码:
pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
 
4、是否邮箱:
pattern:/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
 
5、整数填写:
pattern:/^-?[1-9]\d*$/,
 
6、正整数填写:
pattern:/^[1-9]\d*$/,
 
7、小写字母:
pattern:/^[a-z]+$/,
 
8、大写字母:
pattern:/^[A-Z]+$/,
 
9、大小写混合:
pattern:/^[A-Za-z]+$/,
 
10、多个8位数字格式(yyyyMMdd)并以逗号隔开:
pattern:/^\d{8}(\,\d{8})*$/,
 
11、数字加英文，不包含特殊字符:
pattern:/^[a-zA-Z0-9]+$/,
 
12、前两位是数字后一位是英文:
pattern:/^\d{2}[a-zA-Z]+$/,
 
13、密码校验（6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种）:
pattern:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/,
 
14、中文校验:
pattern:/^[\u0391-\uFFE5A-Za-z]+$/,
```

### el-table 更改行 hover 样式

#### el-table 没有加 fixed 属性的时候

```scss
.el-table tbody tr:hover > td {
  background: #fff !important;
}
```

#### el-table 加了 fixed 属性

```scss
.el-table__body .el-table__row.hover-row td {
  background: var(--normal-green) !important;
}
```
