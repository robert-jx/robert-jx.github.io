---
title: js-获取视频第一帧截图
date: '2023-04-07'
summary: ''
draft: false
tags: [javascript]
canonicalUrl: ''
---
遇到个需求，需要对后端传来的视频进行截图展示，而且还是第一帧的图。因此记录一下，使用canvas来获取视频第一帧相关的base64图片
```javascript
 getVideoBase64(url) {
      return new Promise(function (resolve, reject) {
        let dataURL = "";
        let video = document.createElement("video");
        video.setAttribute("crossOrigin", "anonymous"); //处理跨域
        video.setAttribute("src", url);
        video.setAttribute("width", 400);
        video.setAttribute("height", 240);
        video.setAttribute("preload", "auto");
        video.setAttribute("crossOrigin", "anonymous");
        video.addEventListener("loadeddata", function () {
          let canvas = document.createElement("canvas"),
            width = video.width, //canvas的尺寸和图片一样
            height = video.height;
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
          dataURL = canvas.toDataURL("image/jpeg"); //转换为base64
          resolve(dataURL);
        });
      });
    },
```