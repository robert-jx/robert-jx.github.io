---
title: vue键盘事件
date: '2023-05-17'
summary: ''
draft: false
tags: ['vue3']
canonicalUrl: ''
---

这里对 `vue` 中常用的键盘事件做了一些总结，方便日后查看：

### 介绍

keydown:按下键盘，不需要抬起来就会触发

keyup:按下键盘，等键盘抬起来才会触发

### 用法

用 `v-on:` 或者 `@` 来绑定事件

### 常见按键

|  别名   |                  实际键值                   |
| :-----: | :-----------------------------------------: |
| .delete |      delete（删除）/Backspace（退格）       |
|  .tab   |                     Tab                     |
| .enter  |                Enter（回车）                |
|  .esc   |                 Esc（退出）                 |
| .space  |               Space（空格键）               |
|  .left  |               Left（左箭头）                |
|   .up   |                Up（上箭头）                 |
| .right  |               Right（右箭头）               |
|  .down  |               Down（下箭头）                |
|  .ctrl  |                    Ctrl                     |
|  .alt   |                     Alt                     |
| .shift  |                    Shift                    |
|  .meta  | window 系统：window 键/Mac 系统：command 键 |