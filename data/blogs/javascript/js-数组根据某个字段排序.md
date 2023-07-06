---
title: js-数组根据某个字段排序
date: '2023-07-06'
summary: ''
draft: false
tags: ['javascript']
canonicalUrl: ''
---

### js 数组数组嵌套根据某个字段排序

#### 根据某个字段排序

```js
var arr = [
    {name:'张三',age:15},
    {name:'李四',age:18},
    {name:'王五',age:28}
];

function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;  //降序只需要  return value2- value1
    }
}
console.log(arr.sort(compare('age')))
```

#### 根据某两个字段排序

```js
var arr = [
    {name:'张三',age:15,num:13},
    {name:'李四',age:15,num:16},
    {name:'王五',age:28,num:18},
     {name:'木子李',age:18,num:18}
];

compare (property, p2) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (value1 != value2) {
          return value1 - value2;
        } else {
          return a[p2] - b[p2];
        }
      }
    }
    console.log(arr.sort(compare('age','num')))
```
