---
title: vue3-echarts二次封装
date: '2023-04-08'
summary: 基于vue3+vite+typescript的echarts常见图表的二次封装
draft: false
tags: ['vue3','vite','typescript','element-plus','echarts','scss']
canonicalUrl: ''
---

之前实现了一个基于vue2的echarts组件封装，然后就在想，要不试一下在vue3的环境下封装？

此项目基于vite+vue3+typescript，实现了echarts一些常见图表的二次封装。只需要在引入后对相应的组件传入不同的参数即可实现不同的展示效果。同样也是开箱即用，目前已实现了折线图、柱状图、饼图、雷达图，后续将会更新更多内容。

具体demo链接如下👇

https://github.com/robert-jx/echarts-tool

#### 折线图

效果如图，目前提供了刻度平齐、折线平滑、展示面积等功能

![image](https://robert-jx.oss-cn-shenzhen.aliyuncs.com/blog/vue/vue3-echarts-line.png)

#### 柱状图

效果如图，目前提供了统计内容、堆叠、横向等功能

![image](https://robert-jx.oss-cn-shenzhen.aliyuncs.com/blog/vue/vue3-echarts-bar.png)

#### 饼图

效果如图，仅提供统计内容和环形功能，后续更新

![image](https://robert-jx.oss-cn-shenzhen.aliyuncs.com/blog/vue/vue3-echarts-circle.png)

#### 雷达图

效果如图，后期更新新功能

![image](https://robert-jx.oss-cn-shenzhen.aliyuncs.com/blog/vue/vue3-echarts-radar.png)