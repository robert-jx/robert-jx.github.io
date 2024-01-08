---
title: vue2-jessibuca视频插件的使用
date: '2024-01-08'
summary: 'jessibuca视频插件的使用'
draft: false
tags: ['vue2','jessibuca']
canonicalUrl: ''
---

近期工作上面新增需求：需要支持播放解码 `H.264` 和 `H.265` 的视频。而原来项目中的组件无法满足该需求，因此研究了下 [`jessibuca`](https://jessibuca.com/document.html) 这个插件。

`jessibuca` 是一款开源的纯 `H5` 直播流播放器，通过 `Emscripten` 将音视频解码库编译成 `Js（ams.js/wasm)` 运行于浏览器之中。兼容几乎所有浏览器，可以运行在 PC、手机、微信中，无需额外安装插件。

### 安装与使用

#### 安装

```js-nolint
npm install vue-cli-plugin-jessibuca -D
```

#### 静态资源下载和引入

https://jessibuca.com/demo.html

在该官网下点击`最新源码`下载，解压后找到内部的 `decoder.js`、`jessibuca.js`、`decoder.wasm`、`jessibuca.d` 四个文件移到项目中的 `public` 文件夹中，无需额外创建文件夹。

在 `public` 中的 `index.html` 中引入

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
  <script src="/jessibuca.js"></script>
</html>
```

#### 创建组件

至此，前期准备已准备完毕。接下来需要封装一个组件，用来展示该插件。这里只展示一个视频窗口，多个视频窗口可以自行设计。

```html
<template>
  <div id="container" ref="container"></div>
</template>
<script>
export default {
  name: "DemoPlayer",
  props: {
    videoUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      jessibuca: null,
      version: "",
      wasm: false,
      vc: "ff",
      playing: false,
      quieting: true,
      loaded: false, // mute
      showOperateBtns: true,
      showBandwidth: true,
      err: "",
      speed: 0,
      performance: "",
      volume: 1,
      rotate: 0,
      useWCS: false,
      useMSE: true,
      useOffscreen: false,
      recording: false,
      recordType: "webm",
      scale: 0,
    };
  },
  mounted() {
    this.create();
    window.onerror = (msg) => (this.err = msg);
  },
  unmounted() {
    this.jessibuca.destroy();
  },
  methods: {
    create(options) {
      options = options || {};
      this.jessibuca = new window.Jessibuca(
        Object.assign(
          {
            container: this.$refs.container, //播放器容器
            videoBuffer: 0.2, //设置最大缓冲时长，单位秒，播放器会自动消除延迟
            isResize: false,
            useMSE: true,
            autoWasm: true,
            text: "",
            loadingText: "视频加载中...", //加载过程中文案
            hasAudio: true, //是否有音频，如果设置false，则不对音频数据解码，提升性能
            debug: true, //是否开启控制台调试打印
            supportDblclickFullscreen: true, //是否支持屏幕的双击事件，触发全屏，取消全屏事件
            showBandwidth: this.showBandwidth, //是否显示网速
            //operateBtns 配置操作按钮 其中
            //fullscreen 是否显示全屏按钮
            //screenshot 是否显示截图按钮
            //play 是否显示播放暂停按钮
            //audio 是否显示声音按钮
            //record 是否显示录制按钮
            operateBtns: {
              fullscreen: this.showOperateBtns,
              screenshot: this.showOperateBtns,
              play: this.showOperateBtns,
              audio: this.showOperateBtns,
              record: this.showOperateBtns,
            },
            vod: this.vod,
            forceNoOffscreen: !this.useOffscreen, //是否不使用离屏模式（提升渲染能力）
            isNotMute: true, //是否开启声音，默认是关闭声音播放的。
            timeout: 10,
          },
          options
        )
      );
      var _this = this;
      this.jessibuca.on("pause", function () {
        console.log("on pause");
        _this.playing = false;
      });
      this.jessibuca.on("play", function () {
        console.log("on play");
        _this.playing = true;
      });

      this.jessibuca.on("mute", function (msg) {
        console.log("on mute", msg);
        _this.quieting = msg;
      });

      this.jessibuca.on("error", function (error) {
        console.log("error", error);
      });

      this.jessibuca.on("performance", function (performance) {
        var show = "卡顿";
        if (performance === 2) {
          show = "非常流畅";
        } else if (performance === 1) {
          show = "流畅";
        }
        _this.performance = show;
      });

      this.jessibuca.on("play", () => {
        this.playing = true;
        this.loaded = true;
        this.quieting = this.jessibuca.isMute();
      });
    },
    play(videoUrl) {
      if (videoUrl) {
        this.jessibuca.play(videoUrl);
      } else {
        this.destroy();
      }
    },
    mute() {
      this.jessibuca.mute();
    },
    cancelMute() {
      this.jessibuca.cancelMute();
    },

    pause() {
      this.jessibuca.pause();
      this.playing = false;
      this.err = "";
      this.performance = "";
    },
    destroy() {
      if (this.jessibuca) {
        this.jessibuca.destroy();
      }
      this.create();
      this.playing = false;
      this.loaded = false;
      this.performance = "";
    },
  },
};
</script>
<style>
#container {
  background: rgba(13, 14, 27, 0.7);
  width: 100%;
  height: 100%;
}
</style>
```

#### 使用

在需要用到的页面引入该组件，并设置 `ref`，这里仅展示，具体根据实际需求来处理。

```html
<template>
  <div class="home">
    <vue-player ref="vue-player"></vue-player>
  </div>
</template>

<script>
import vuePlayer from "@/components/vue-player";
export default {
  name: "HomeView",
  components: { vuePlayer },
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      let url = "xxx.flv";
      this.$refs["vue-player"].play(url);
    },
  },
};
</script>
<style lang='scss' scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
```