---
title: threejs-镜头切换
date: '2023-10-23'
summary: 关于如何丝滑的进行镜头切换
draft: false
tags: ['vue2','three.js']
canonicalUrl: ''
---

### 引言

在做关于 `three.js` 的项目的时候，总会遇到通过不同的点击事件进行镜头间的切换问题。有时候需要这些镜头间切换的丝滑一些，而不是生硬的直接切换。那么这里引入一个 `tween.js` 库来实现这个效果。

### 安装与引入

#### 安装

```js-nolint
npm install --save @tweenjs/tween.js
```

#### 引入

```js
import TWEEN from "@tweenjs/tween.js";
```

### 使用

首先先创建一个处理镜头间切换的函数

```js
animateCamera(oldP, oldT, newP, newT, callBack) {
  var tween = new TWEEN.Tween({
    x1: oldP.x, // 相机x
    y1: oldP.y, // 相机y
    z1: oldP.z, // 相机z
    x2: oldT.x, // 控制点的中心点x
    y2: oldT.y, // 控制点的中心点y
    z2: oldT.z, // 控制点的中心点z
  });
  tween.to(
    {
      x1: newP.x,
      y1: newP.y,
      z1: newP.z,
      x2: newT.x,
      y2: newT.y,
      z2: newT.z,
    },
    1000
  );
  tween.onUpdate(function (object) {
    camera.position.x = object.x1;
    camera.position.y = object.y1;
    camera.position.z = object.z1;
    controls.target.x = object.x2;
    controls.target.y = object.y2;
    controls.target.z = object.z2;
    controls.update();
  });
  tween.onComplete(function () {
    controls.enabled = true;
    callBack && callBack();
  });
  tween.easing(TWEEN.Easing.Cubic.InOut);
  tween.start();
},
```

之后记得在渲染函数那里添加 `TWEEN.update()`

```js
// 渲染
render() {
  if (renderer) {
    TWEEN.update();
    modelId = requestAnimationFrame(this.render);
    renderer.render(scene, camera);
    controls.update();
  }
},
```