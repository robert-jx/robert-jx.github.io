---
title: js-获取image图片的原始尺寸
date: '2023-06-06'
summary: ''
draft: false
tags: ['javascript']
canonicalUrl: ''
---

有时需要使用到图片原始尺寸来进行一些运算，以下是一些方法记录：

### 方法一：Image 对象

通过 Image 对象，异步获取图片尺寸。

```js
let url ='';

function getImageSize(url) {
    return new Promise(function (resolve, reject) {
        let image = new Image();
        image.onload = function () {
            resolve({
                width: image.width,
                height: image.height
            });
        };
        image.onerror = function () {
            reject(new Error('error'));
        };
        image.src = url;
    });
}

(async () => {
    let size = await getImageSize(url);
    console.log(size);
})();
```

### 方法二：naturalWidth

通过 `HTML5` 属性 `natural`（naturalWidth, naturalHeight）获取

```html
<style>
    .image {
        width: 200px;
        height: 100px;
    }
</style>

<img class="image"
     src=""
     alt="">

<script>
    // 适用于Firefox/IE9/Safari/Chrome/Opera浏览器
    let image = document.querySelector('.image');
    console.log(image.naturalWidth, image.naturalHeight);
    // 1920 1200
    
</script>
```

### 方法三：兼容写法

```html
<img class="image"
         src=""
         alt="">

<script>
    function getImageSizeByUrl(url) {
        return new Promise(function (resolve, reject) {
            let image = new Image();
            image.onload = function () {
                resolve({
                    width: image.width,
                    height: image.height
                });
            };
            image.onerror = function () {
                reject(new Error('error'));
            };
            image.src = url;
        });
    }

    async function getImageSize(img) {

        if (img.naturalWidth) {
            // 适用于Firefox/IE9/Safari/Chrome/Opera浏览器
            console.log('naturalWidth');
            return {
                width: img.naturalWidth,
                height: img.naturalHeight
            }
        } else {
            console.log('getImageSizeByUrl');
            return await getImageSizeByUrl(img.src);
        }
    }

    (async () => {
        let image = document.querySelector('.image');
        let size = await getImageSize(image);
        console.log(size);
    })();
    // {width: 1920, height: 1200}
</script>
```
