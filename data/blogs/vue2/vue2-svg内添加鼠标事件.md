---
title: vue2-svg内添加鼠标事件
date: '2024-01-12'
summary: ''
draft: false
tags: ['vue2','svg']
canonicalUrl: ''
---

项目有个需求，需要在 `svg` 中点击某个部分时有交互。而 `svg` 图片会提供相关数据。类似地铁线路图的交互那样，那么如何获取到点击部分的数据是个问题。

因此记录一下，这里只展示鼠标点击事件。同理可以写鼠标移入移出事件等，甚至修改样式，这里就不做过多阐述。

####代码

```html
<template>
  <div class="svg-class" id="svg-container"></div>
</template>

<script>
import axios from "axios";
export default {
  name: "svg",
  data() {
    return {
      svgPath: "/static/test.svg", //svg文件路径
      svgData: "", //svg文件内容}
    };
  },
  created() {},
  mounted() {
    // 将svgClick方法绑定到window下面，提供给外部调用
    window["handleClick"] = (evt, id) => {
      this.svgClick(evt, id);
    };
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      // ajax请求数据，并携带参数
      axios
        .get(this.svgPath)
        .then(
          (response) => {
            // 将svg平面图显示在制定容器中
            var svgContainer = document.getElementById("svg-container");
            svgContainer.innerHTML = response.data;
            svgContainer.style.width = "100%";
            svgContainer.style.height = "100%";
            // 遍历svg里面的元素，自动添加鼠标事件
            this.addMouseEvent(svgContainer);
          },
          (err) => {
            console.log(err);
          }
        )
        .catch((error) => {
          console.log(error);
        });
    },
    addMouseEvent(parent) {
      for (var i = 0; i < parent.childNodes.length; i++) {
        //循坏svg里面的元素
        var child = parent.childNodes[i];
        // 判断是不是g元素，并且具有id值，是的话，就添加鼠标事件
        if (child.tagName == "circle") {
          child.setAttribute(
            "onclick",
            "handleClick(evt,'" + child.getAttribute("station_id") + "')"
          );
        }
        //继续递归遍历子元素
        this.addMouseEvent(child);
      }
    },
    svgClick(e, id) {
      console.log("e", e);
      console.log("id", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-class {
  width: 100%;
  height: 100%;
  background: #56555e;
  &::v-deep svg {
    width: 100%;
    height: 100%;
  }
}
</style>
```