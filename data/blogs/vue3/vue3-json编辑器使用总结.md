---
title: vue3-json编辑器使用总结
date: '2024-05-21'
summary: ''
draft: false
tags: ['vue3','json-editor-vue3']
canonicalUrl: ''
---

在新的项目中，需要对设备进行消息下发。

这里需要对 json 格式的数据进行编辑操作并下发，因此这里引用了 `json-editor-vue3` 这个组件。

在此做一些总结：

### 安装与引用

```js-nolint
npm install json-editor-vue3
```

安装后在对应使用的页面里面引用，这里因为用的 vue3+ts 可能会报一个无法引入的错误。

```ts
import JsonEditorVue from 'json-editor-vue3';
```

这个时候就需要在 main.ts 旁边新建一个文件去声明，我这里新建的是 declare.d.ts。

```ts
declare module 'json-editor-vue3';
```

接着在 main.ts 里面去引入这个声明即可。

```ts
import "./view/declare.d.ts"
```

### 使用

在对应的使用页面引入好之后，直接使用即可。这里默认是英文显示的，设置了 language 即可转换为中文显示。

```html
<json-editor-vue ref="jsonEditor" class="editor" style="width: 100%;" v-model="form.params" language="['zh-cn']" />
```

### 深色样式修改

在这里为了适应项目的主题色，我对这个插件的样式进行了一些修改。引入到使用该插件的页面即可。

```css

::v-deep .jsoneditor {
    color: #fff;
    border: thin solid #de7f29;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    line-height: 100%;
}

::v-deep .jsoneditor-menu {
    width: 100%;
    height: 35px;
    padding: 2px;
    margin: 0;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    background-color: #de7f29;
    border-bottom: 1px solid #de7f29;
}

::v-deep .ace-jsoneditor .ace_gutter,
::v-deep .ace-jsoneditor .ace_marker-layer .ace_active-line {
    background: #2b2b2b;
    color: #fff;
}

::v-deep .ace-jsoneditor .ace_variable {
    color: #fff;
}

::v-deep .ace-jsoneditor .ace_gutter-active-line {
    background-color: #222;
}

::v-deep .ace-jsoneditor .ace_scroller {
    background-color: #222;
}

::v-deep .jsoneditor-statusbar {
    line-height: 26px;
    height: 26px;
    color: #fff;
    background-color: #2b2b2b;
    border-top: 1px solid #222;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
}

::v-deep .ace-jsoneditor .ace_text-layer {
    color: #fff;
}
```

然后你会发现终端抛出了警告：

```js-nolint
::v-deep usage as a combinator has been deprecated. Use :deep(<inner-selector>) instead of ::v-deep <inner-selector>.
```

原因在于 ::v-deep 作为组合器的用法废弃，要使用 :deep(<inner-selector>) 语法来代替；

所以修改如下

```css
::v-deep(.jsoneditor) {
    color: #fff;
    border: thin solid #de7f29;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    line-height: 100%;
}

::v-deep(.jsoneditor-menu) {
    width: 100%;
    height: 35px;
    padding: 2px;
    margin: 0;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    background-color: #de7f29;
    border-bottom: 1px solid #de7f29;
}

::v-deep(.ace-jsoneditor .ace_gutter),
::v-deep(.ace-jsoneditor .ace_marker-layer .ace_active-line) {
    background: #2b2b2b;
    color: #fff;
}

::v-deep(.ace-jsoneditor .ace_variable) {
    color: #fff;
}

::v-deep(.ace-jsoneditor .ace_gutter-active-line) {
    background-color: #222;
}

::v-deep(.ace-jsoneditor .ace_scroller) {
    background-color: #222;
}

::v-deep(.jsoneditor-statusbar) {
    line-height: 26px;
    height: 26px;
    color: #fff;
    background-color: #2b2b2b;
    border-top: 1px solid #222;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
}

::v-deep(.ace-jsoneditor .ace_text-layer) {
    color: #fff;
}
```