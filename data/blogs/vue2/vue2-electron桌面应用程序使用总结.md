---
title: vue2-electron桌面应用程序使用总结
date: '2024-05-14'
summary: ''
draft: false
tags: ['vue2','electron']
canonicalUrl: ''
---

偶然接触到 `electron`，它可以和 vue 结合封装一个桌面应用程序。学习总结如下：

### 安装与使用

第一步，先设置成最新的镜像地址

```js-nolint
npm config set registry https://registry.npmmirror.com
```

第二步，设置 `ELECTRON_MIRROR` 环境变量，将 `Electron` 的下载地址切换到国内的镜像源上

```js-nolint
npm config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/
```

接着在 vue 的项目终端中输入：`vue add electron-builder`

```js-nolint
vue add electron-builder
```

版本选择最新的，之后便可以安装完成

使用命令如下：

```js-nolint
npm run electron:build 为 electron 打包方法
npm run electron:serve 为 electron 本地运行方法
```