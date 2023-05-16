---
title: nvm基本使用
date: '2023-05-16'
summary: nvm的安装和使用
draft: false
tags: ['nvm']
canonicalUrl: ''
---

### 介绍

[`node.js`](https://nodejs.org/en) 相信大家都不陌生，前端开发必备工具之一。但是工作的时候，容易遇到不同的项目需要不同的 `node` 版本依赖。这种情况，总不能用这个版本的时候把原来的给删掉然后重装一遍吧？这对于项目的维护以及我们的日常工作带来了不便。因此 `nvm` 应运而生，它就是为了解决该类问题，可以让一个设备在不同的 `node` 版本中切换自如。

### 下载、安装和使用

#### 下载

这里以 `windows` 系统为例，[安装包地址](https://nodejs.org/en)为：https://nodejs.org/en 。下载 `nvm-setup.zip` 安装包。

#### 安装

如果电脑已经安装了 `node` 了，那先把原来的给卸载掉。保证卸载干净后解压 `nvm-setup.zip` 安装包。进入解压的文件夹，双击exe后缀文件进行安装。一路next，记清下载到哪个位置。

#### 查看版本号

安装好之后，通过进入 `cmd`，输入以下指令来查看版本号。

```js-nolint
nvm -V
```

#### 配置国内镜像

安装好后，找到安装位置中的 `settings.txt` 文件，双击打开，换行输入以下内容：

```js-nolint
node_mirror: https://npm.taobao.org/mirrors/node/

npm_mirror: https://npm.taobao.org/mirrors/npm/
```

然后保存，退出。

#### 安装 node

在完成 `nvm` 的安装后，接下来就可以使用了。我们通过 `nvm list available` 查看可以安装的 `node` 版本列表。当然也可以安装在这个列表之外的 `node` 版本，不过需要输入正确的版本号。

```js-nolint
nvm list available
```

在找到想要安装的版本号后，通过输入 `nvm install 版本号` 即可安装。卸载则使用 `nvm uninstall 版本号`。

```js-nolint
nvm install 16.18.0
```

#### 使用

当一切就绪后，我们通过打开 `cmd` 输入 `nvm ls` 查看已安装的版本号。然后输入 `nvm use 版本号` 即可切换为该版本。注意：有些切换不成功的话，可能需要使用管理员权限打开 `cmd`。

```js-nolint
nvm ls
nvm use 16.18.0
```

这样我们就能随时的切换 `node` 版本了，这里还有一些常用指令：

```js-nolint
nvm off                     // 禁用node.js版本管理(不卸载任何东西)
nvm on                      // 启用node.js版本管理
nvm install <version>       // 安装node.js的命名 version是版本号 例如：nvm install 8.12.0
nvm uninstall <version>     // 卸载node.js是的命令，卸载指定版本的nodejs，当安装失败时卸载使用
nvm ls                      // 显示所有安装的node.js版本
nvm list available          // 显示可以安装的所有node.js的版本
nvm use <version>           // 切换到使用指定的nodejs版本
nvm v                       // 显示nvm版本
nvm install stable          // 安装最新稳定版
```