---
title: js-获取屏幕缩放比例和分辨率
date: '2023-06-13'
summary: ''
draft: false
tags: ['javascript']
canonicalUrl: ''
---

通过 javascript 可以获取到当前使用屏幕的缩放比例和分辨率。

### 获取屏幕缩放比例

```js
//获取屏幕缩放比例
function getRatio()
{
    var ratio=0;
    var screen=window.screen;
    var ua=navigator.userAgent.toLowerCase();
 
    if(window.devicePixelRatio !== undefined)
    {
        ratio=window.devicePixelRatio;    
    }
    else if(~ua.indexOf('msie'))
    {
        if(screen.deviceXDPI && screen.logicalXDPI)
        {
            ratio=screen.deviceXDPI/screen.logicalXDPI;        
        }
    
    }
    else if(window.outerWidth !== undefined && window.innerWidth !== undefined)
    {
        ratio=window.outerWidth/window.innerWidth;
    }
 
    if(ratio)
    {
        ratio=Math.round(ratio*100);    
    }
    return ratio;
}
```

### 获取屏幕分辨率

```js
   屏幕分辨率的高：window.screen.height*getRatio()/100   //乘以缩放比例为真实的像素
   屏幕分辨率的宽：window.screen.width*getRatio()/100    //乘以缩放比例为真实的像素
   屏幕可用工作区高度：window.screen.availHeight;    
   屏幕可用工作区宽度：window.screen.availWidth;
```
