---
title: ant-design-vue总结
date: '2023-05-12'
summary: ant-design-vue安装使用及常见问题总结
draft: false
tags: ['vue2','ant-design-vue']
canonicalUrl: ''
---

近期有些空余时间，便将以往遇到过的关于如何引入并使用 `ant-design-vue` 以及遇到的一些常见问题进行了一些总结。先从如何引入使用讲起吧！

### 介绍

[`Ant Design Vue`](https://2x.antdv.com/docs/vue/introduce-cn) 是遵循 `Ant Design` 的 `Vue` 组件库。是蚂蚁金服 `Ant Design` 官方唯一推荐的 `Vue` 版 `UI` 组件库。

### 安装与引入

#### 使用npm安装

```js-nolint
$ npm i --save ant-design-vue@next
```

#### 完整引入

```js
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';

const app = createApp();
app.config.productionTip = false;

app.use(Antd);
```

#### 也可以选择局部导入

```js
import { createApp } from 'vue';
import { Button, message } from 'ant-design-vue';
import App from './App';

const app = createApp(App);
app.config.productionTip = false;

/* 会自动注册 Button 下的子组件, 例如 Button.Group */
app.use(Button).mount('#app');

app.config.globalProperties.$message = message;
```

之后运行项目，便可以发现 `ant-design-vue` 已经成功引入并可以使用了。接下来时常见问题总结👇

### 常见问题

#### ​Antd Vue-Warning: You cannot set a form field before rendering a field associated with the value

出错主要原因有两种：调用 `setFieldsValue()` 传入表单的值与表单不对应/调用 `setFieldsValue()` 需要在需要放在 `$nextTick()` 函数中执行。

先看第一种，有多少传多少

```js
this.form.setFieldsValue({ demo: '1' })
```

第二种，放在$nextTick()中执行

```js
this.$nextTick(()=>{
    this.form.setFieldsValue({demo:'1'})
})
```

#### ​Ant Design Vue-Table 报错：warning.js?2149:7

warning.js?2149:7 Warning: [antdv: Each record in table should have a unique `key` prop,or set `rowKey` to an unique primary key.] 

这是因为columns中定义的默认key值在返回的数据中没有当前的这个字段造成的，一个是使用rowKey默认指定一个对应的键值对，或者使用类似v-for循环中的下标index来代替。因此在table组件里面引入下面字段即可：

```js
:rowKey="(record,index)=>{return index}"
```

引入后如下：

```html
<a-table :columns="columns" :data-source="data" :rowKey="(record,index)=>{return index}" 
```

#### Ant Design Vue-upload 获取音频/视频时长

结合 `a-upload` 使用时，只需要在上传前调用以下代码即可

```js
let url = URL.createObjectURL(this.file);
let audioElement = new Audio(url);
let duration = parseInt(audioElement.duration);
  audioElement.addEventListener("loadedmetadata",
    () => {
    this.duration = parseInt(audioElement.duration); //时长为秒，取整          
    console.log(this.duration);
});
```

#### Ant Design Vue 下拉框随页面滚动而分离的问题

之前遇到个下拉框随页面滚动而分离的问题，后面查找资料。

如果是 [`a-select`](https://2x.antdv.com/components/select-cn) 的，只需要在 `a-select` 里面配置以下内容即可。

```js
:getPopupContainer="triggerNode => triggerNode.parentNode"
```

如果是日期选择的，只需要加入以下内容

```js
:getCalendarContainer="triggerNode=> triggerNode.parentNode"
```

#### Ant Design Vue-cascader：修改默认值

需求：需要在选择一个内容后填充其他信息到级联选择器中。

首先了解级联选择器的基本用法：

```html
<template>
  <a-cascader :options="options" placeholder="Please select" @change="onChange" />
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    onChange(value) {
      console.log(value);
    },
  },
};
</script>
```

想要在选择的同时改变值的话，只需要加入 `change-on-select` 这个属性，如下：

```html
<template>
  <a-cascader :options="options" change-on-select @change="onChange" />
</template>
```

接着就是如何选择内容填充到级联选择器中，有一种是直接给 `v-model` 的值进行赋值。还有一种就是通过 `this.form.setFieldsValue({})` 进行赋值。最重要的是赋的值要与原本级联选择器导出的数据相同格式。

```html
<template>
  <a-cascader 
    :fieldNames="{
        label: 'name',
        value: 'id',
        children: 'children',
     }" 
    v-model="demo" 
    :options="options" 
    change-on-select 
    @change="onChange" />
  <a-button type="primary" @click="setDemo">点我赋值</a-button>
</template>

<script>
export default {
  data() {
    return {
      options: [
        value:1,
        name:'parent',
        children:[
            ...
        ]
      ],
      demo:[]
    };
  },
  methods: {
    onChange(value) {
      console.log(value);
    },
    setDemo(){
        this.demo = ['1','2']
    }
  },
};
</script>
```

这里展示了自定义变量名的方法，就是定义以下内容就行。`name`、`id`、`children` 都是我自定义的。

```
:fieldNames="{
    label: 'name',
    value: 'id',
    children: 'children'
}"
```

接着是 `this.form.setFieldsValue({})`，这个是当你不使用 `v-model` 而是使用 `v-decorator` 的情况下使用。常与 `this.form.validateFields((err, formData){}` 配合使用。

```html
<template>
  <a-cascader 
    :fieldNames="{
        label: 'name',
        value: 'id',
        children: 'children',
     }" 
    v-decorator="[
        'demo',
        {
            rules: [{ required: true, message: 'demo不能为空' }],
        },
    ]" 
    :options="options" 
    change-on-select 
    @change="onChange" />
  <a-button type="primary" @click="setDemo">点我赋值</a-button>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      options: [
        value:1,
        name:'parent',
        children:[
            ...
        ]
      ]
    };
  },
  methods: {
    onChange(value) {
      console.log(value);
    },
    setDemo(){
        this.$nextTick(()=>{
            this.form.setFieldsValue({
                demo:['1','2'.....]
            })
        })
    }
  },
};
</script>
```

#### Ant Design Vue-tree：默认展开到第几层

需求：每次打开页面时 `tree` 组件需要默认展开到第几层，记录一下。先看看基础用法，展示可勾选，可选中，禁用，默认展开等功能。更多用法可以去看[树形控件](https://2x.antdv.com/components/tree-cn)

```html
<template>
  <a-tree
    checkable
    :tree-data="treeData"
    :default-expanded-keys="['0-0-0', '0-0-1']"
    :default-selected-keys="['0-0-0', '0-0-1']"
    :default-checked-keys="['0-0-0', '0-0-1']"
    @select="onSelect"
    @check="onCheck"
  >
    <span slot="title0010" style="color: #1890ff">sss</span>
  </a-tree>
</template>
<script>
const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
          { title: 'leaf', key: '0-0-0-1' },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ key: '0-0-1-0', slots: { title: 'title0010' } }],
      },
    ],
  },
];

export default {
  data() {
    return {
      treeData,
    };
  },
  methods: {
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info);
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info);
    },
  },
};
</script>
```

`:default-expanded-keys` 表示的是默认展开的值，我的思路是：`default-expanded-keys="expandedKeys"`，然后在获取数据时对这个 `expandedKeys` 进行添加操作，如下：

```html
<script>
    export default{
        name:'demo',
        data(){
            return{
                demoList:[]
            }
        },
        methods:{
            getExpendKeys(){
            //demoList是树的option项
                this.demoList.forEach(v => {
                    if (v.children) {
                      this.expandedKeys.push(v.id);
                        //若继续往下展开则添加下面的语句，以此类推
                        //v.children.forEach(el => {
                        //this.expandedKeys.push(el.id);
                      //})
                }
              })
            }
        }
    }
</script>
```

#### Ant Design Vue 下拉选择框支持输入搜索

```html
 <a-select
     class="search-select"
     placeholder="全部"
     v-model="jobsId"
     show-search
     option-filter-prop="children"
     :filter-option="filterOption"
     @focus="handleFocus"
     @blur="handleBlur"
     @change="handleChange"
>
     <a-select-option
          v-for="(item, index) in list"
          :key="index"
          :value="item.id"
     >{{item.name}}</a-select-option>
</a-select>
```

```js
 handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur() {
      console.log("blur");
    },
    handleFocus() {
      console.log("focus");
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
```
