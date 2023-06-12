---
title: js-数组与树之间的转换
date: '2023-05-12'
summary: ''
draft: false
tags: ['javascript']
canonicalUrl: ''
---

### 数组与树之间的转换

在很多业务场景中，时常需要我们将一个树形结构的数据转换成数组遍历，亦或者一个数组数据拼接成一个树形结构。因此封装了一下方法，这里使用的是递归加深拷贝。如果树形结构不复杂，也可以考虑不断使用 `for` 循环。不过这里优先使用递归：

```js
//树转换为数组
treeToArr(list) {
  let tree = list;
  var arr = [];
  function spread(tree, parentId) {
    for (var i = 0; i < tree.length; i++) {
      let item = tree[i];
      let obj = JSON.parse(JSON.stringify(tree[i])); // 深拷贝
      let { id, name } = obj;
      let children = obj.children;
      let maxlength =
        obj.children && obj.children.length ? obj.children.length : 0;
      arr.push({ id, name, parentId, maxlength, children });
      if (item.children) {
        spread(item.children, item.id);
        delete item.children;
      }
    }
  }
  spread(tree, 0);
  return arr;
},
```

当然，这里的赋值算法可以根据实际情况进行调整，重要的是递归思想。

```js
// 数组转换为树
arrToTree(list, rootValue) {
  const deepList = JSON.parse(JSON.stringify(list)); // 深拷贝
  const arr = [];
  deepList.forEach((item) => {
    if (item.parentId === rootValue) {
      const children = arrToTree(deepList, item.id);
      children.length ? (item.children = children) : false;
      // item.children = children // 如果希望每个item都有children属性, 可以直接赋值
      arr.push(item);
    }
  });
  return arr;
},
```
