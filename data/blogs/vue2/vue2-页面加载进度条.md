---
title: vue2-页面加载进度条
date: '2023-04-07'
summary: 如何实现页面加载进度条
draft: false
tags: ['vue2']
canonicalUrl: ''
---
在一些项目中，经常见到切换页面的时候。页面顶部出现一个进度条，使得页面过渡较为平滑。常见的实现方式是使用nprogress插件

如何使用该插件？

1、首先需要安装nprogress插件
```
npm i -s nprogress
```

2、安装好后需要在main.js里面进行配置
```
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


NProgress.configure({     

     easing: 'ease',  // 动画方式    

     speed: 500,  // 递增进度条的速度    

     showSpinner: false, // 是否显示加载ico    

     trickleSpeed: 200, // 自动递增间隔    

     minimum: 0.3 // 初始化时的最小百分比

 })
```

3、紧接着只需要在路由相关文件(常见：router.js)中使用
```
//当路由进入前

 router.beforeEach((to, from , next) => {

     // 每次切换页面时，调用进度条

    NProgress.start();

    // 这个一定要加，没有next()页面不会跳转的

     next();

 });

//当路由进入后：关闭进度条

router.afterEach(() => {  

    // 在即将进入新的页面组件前，关闭掉进度条

    NProgress.done()
});

```
