---
title: vue2-div元素键盘事件监听问题
date: '2024-05-14'
summary: ''
draft: false
tags: ['vue2']
canonicalUrl: ''
---

### vue2-div元素键盘事件失效

项目需求中出现需要在树中实现上下键切换的效果，而在自定义树中的 div 元素中，键盘事件失效。

浏览资料后发现，需要给对应的 div 添加一个 `tabindex=0` 属性。

```html
<span class="custom-tree-node" slot-scope="{ data }" @keyup.up='keyUpUp(data)' tabindex=0>
    ...
</span>
```

问：那么这个 `tabindex=0` 属性到底是啥东西？

答：

当使用键盘时，`tabindex` 是个关键因素，它用来定位 html 元素。`tabindex` 有三个值：0 ，-1， 以及大于0 的数字（通常也要小于32767，否则跟0一样）。

当 `tabindex=0` 时，该元素可以用 tab 键获取焦点，且访问的顺序是按照元素在文档中的顺序来 focus，即使采用了浮动改变了页面中显示的顺序，依然是按照 html 文档中的顺序来定位。

当 `tabindex=-1` 时，该元素用 tab 键获取不到焦点，但是可以通过 js 获取，这样就便于我们通过 js 设置上下左右键的响应事件来 focus，在 widget 内部可以用到。

当 `tabindex>=1` 时，该元素可以用 tab 键获取焦点，而且优先级大于 `tabindex=0`；不过在 `tabindex>=1` 时，数字越小，越先定位到。
