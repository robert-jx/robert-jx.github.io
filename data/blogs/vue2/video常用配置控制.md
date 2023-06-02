---
title: video常用配置控制
date: '2023-06-01'
summary: '隐藏video的各种控件'
draft: false
tags: ['vue2','video']
canonicalUrl: ''
---

在 `vue` 项目开发中，有时候需要对 `video` 原生组件中的配置进行一些操作。归纳如下：

### 阻止视频 video 标签点击视频区域播放暂停

```js
<video controls id="videoContent" autoplay muted playsinline></video>

myVid = document.getElementById("videoContent");
 
myVid.addEventListener("click", mouseHandler, false);
 
function mouseHandler(event) {
      // 阻止视频默认点击事件
      event.preventDefault()
}
```

### 隐藏 video 的各种控件

```scss
/* 隐藏video 全屏按钮 */
.video::-webkit-media-controls-fullscreen-button {
    display: none;
}
/* 隐藏video 播放按钮 */
.video::-webkit-media-controls-play-button {
    display: none;
}
/* 隐藏video 进度条 */
.video::-webkit-media-controls-timeline {
    display: none;
}
/* 隐藏video 观看的当前时间 */
.video::-webkit-media-controls-current-time-display{
    display: none;            
}
/* 隐藏video 剩余时间 */
.video::-webkit-media-controls-time-remaining-display {
    display: none;            
}
/* 隐藏video 音量按钮 */
.video::-webkit-media-controls-mute-button {
    display: none;            
}
.video::-webkit-media-controls-toggle-closed-captions-button {
    display: none;            
}
/* 隐藏video 音量的控制条 */
.video::-webkit-media-controls-volume-slider {
    display: none;            
}
/* 隐藏video 所有控件 */
.video::-webkit-media-controls-enclosure{ 
    display: none;
}
```