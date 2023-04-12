---
title: blowup-picture
date: '2023-04-12'
summary: 基于clip-path实现的不规则区域放大效果
draft: false
tags: ['vue3','css3']
canonicalUrl: ''
---

### 图片区域放大效果实现

有个需求，需要根据后端传回来的点位数据来实现平面图里不规则区域放大的效果。

这里记录的是通过原生css3实现的方式：**clip-path**

#### 何为clip-path？

clip-path是css的属性，其可以创建一个只有元素的部分区域可以显示的剪切区域。达到区域内的部分显示，区域外的隐藏的效果。

首先了解下clip-path使用方式：

#### inset

将元素裁剪成一个矩形

```
clip-path: inset( <距离元素上面的距离>,<距离元素右面的距离> ,<距离元素下面的距离>,<距离元素左面的距离>,<圆角边框> ），括号内的值类似于margin、padding值的写法。


例：clip-path: inset(2px 2px 20px 20px round 10px);
```

#### circle

将元素裁剪成一个圆形

```
clip-path: circle(圆的半径 at 圆心)

例：clip-path: circle(40px at 50% 50%)
```

#### ellipse

将元素裁剪成一个椭圆

```
clip-path: ellipse(圆的水平半径 圆的垂直半径 at 圆心)

例：clip-path: ellipse(20px 40px at 50% 50%)
```

#### polygon

将元素裁剪成多边形

其实就是描点，多点连线，最少需要三个点，以距离左上角的长度为单位，可参考canvas的画布坐标写法。

```
clip-path: polygon(<距离左上角的X轴长度  距离左上角Y轴的长度>，<距离左上角的X轴长度  距离左上角Y轴的长度>，<距离左上角的X轴长度  距离左上角Y轴的长度>)

例：clip-path: polygon(40px 0px, 0px  80px, 80px 80px);
```

了解了用法之后，那么我的初步思路就是：

数据的处理，对每个数据进行处理，添加一个path属性，里面存放clip-path的各种拼接好的值

可以用一层作为底图展示平面图，然后再通过循环遍历数组给容器添加裁剪后的图片（均使用同一图片做为背景图供clip-path去裁剪）

之后给这些裁剪好的图片添加一个hover类，添加一个translate效果，实现放大效果。

具体的可以参考下demo👇

demo连接：https://github.com/robert-jx/blowup-picture