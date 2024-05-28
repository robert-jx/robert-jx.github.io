---
title: vue2-百度GL地图轨迹功能的实现
date: '2024-05-28'
summary: ''
draft: false
tags: ['vue2','BMapGL']
canonicalUrl: ''
---

最近研究了下离线地图如何实现轨迹功能，在此记录下：

### 引入

首先，轨迹功能需要用到的是 `BMapGLLib` 而不是 `BMapGL`，所以我们需要额外引入一下这个库的文件。

对应轨迹功能的文件是 `TrackAnimation.min.js`，内容如下👇，网上也能找到。

```js
var BMapGLLib=window.BMapGLLib=BMapGLLib||{};(function(){var g=1;var f=55;var e=0;var a=10000;var i=0;var c=true;var d=1;var j=2;var k=3;var b=0;var h=BMapGLLib.TrackAnimation=function(n,l,m){this._map=n;this._polyline=l;this._totalPath=l.getPath();this._overallView=n.getViewport(l.getPath());this._status=j;this._opts={zoom:this._getZoom(),tilt:f,heading:e,duration:a,delay:i,overallView:c};this._initOpts(m);this._expandPath=this._addPath(l.getPath());this._pauseTime=0;this._last2Points=[]};h.prototype._getZoom=function(){return Math.min(this._overallView.zoom+g,this._map.getMaxZoom())};h.prototype._updateAniParams=function(){this._updatePathAni();this._updateViewAni();this._polyline.setPath(this._expandPath.slice(0,1))};h.prototype._updatePathAni=function(){this._expandPath=this._addPath(this._totalPath)};h.prototype._updateViewAni=function(){this._overallView=this._map.getViewport(this._totalPath);var q=this._totalPath.length;var p=[];var r=this._opts.overallView?this._opts.duration+2000:this._opts.duration;for(var l=0;l<q;l++){var o=this._totalPath[l];var n=this._pathPercents[l]*(this._opts.duration/r);p.push({center:new BMapGL.Point(o.lng,o.lat),zoom:this._opts.zoom,tilt:l===0?0:this._opts.tilt,heading:l===0?0:this._opts.heading,percentage:n})}if(this._opts.overallView){p.push({center:new BMapGL.Point(this._overallView.center.lng,this._overallView.center.lat),zoom:this._overallView.zoom-g,tilt:0,heading:0,percentage:1})}var m={duration:r,delay:0,interation:1};this._viewAni=new BMapGL.ViewAnimation(p,m)};h.prototype._addPath=function(u){var o=this._opts.duration/10;var m=u.length;var s=0;var t=[];var p=[];for(var q=1;q<m;q++){var l=this._map.getDistance(u[q-1],u[q]);t.push(l);s+=l}var n=[0];for(var q=1;q<m;q++){var r=(t[q-1]/s).toFixed(2);n[q]=n[q-1]+parseFloat(r,10);p=p.concat(this._getPath(u[q-1],u[q],r*o))}this._pathPercents=n;return p};h.prototype._getPath=function(q,n,o){var m=[];if(o===0){return m}for(var p=0;p<=o;p++){var l=new BMapGL.Point((n.lng-q.lng)/o*p+q.lng,(n.lat-q.lat)/o*p+q.lat);m.push(l)}return m};h.prototype._initOpts=function(l){for(var m in l){if(l.hasOwnProperty(m)){this._opts[m]=l[m]}}};h.prototype.start=function(){var l=this;setTimeout(function(){l._updateAniParams();l._map.removeOverlay(l._polyline);l._map.addOverlay(l._polyline);l._status=d;l._step(performance.now());l._map.startViewAnimation(l._viewAni)},this._opts.delay)};h.prototype.cancel=function(){this._clearRAF();this._status=j;b=0;this._pauseTime=0;this._map.cancelViewAnimation(this._viewAni);this._map.removeOverlay(this._polyline)};h.prototype.pause=function(){if(this._status===d){this._clearRAF();this._map.pauseViewAnimation(this._viewAni);this._status=k;this._isPausing=performance.now()}};h.prototype.continue=function(){if(this._status===k){this._pauseTime+=performance.now()-this._isPausing;this._isPausing=undefined;this._status=d;this._step(performance.now());this._map.continueViewAnimation(this._viewAni)}};h.prototype._step=function(o){if(this._status===j){b=0;return}if(!b){b=o}o=o-this._pauseTime;var n=(o-b)/this._opts.duration;var l=Math.round(this._expandPath.length*n);var m=this._expandPath.slice(0,l);this._last2Points=m.slice(-4);this._polyline.setPath(m);if(o<b+this._opts.duration){this._timer=window.requestAnimationFrame(this._step.bind(this))}else{b=0;this._status=j;this._pauseTime=0}};h.prototype._clearRAF=function(){if(this._timer){window.cancelAnimationFrame(this._timer)}};h.prototype.setZoom=function(l){this._opts.zoom=l};h.prototype.getZoom=function(l){return this._opts.zoom};h.prototype.setTilt=function(l){this._opts.tilt=l};h.prototype.getTilt=function(l){return this._opts.tilt};h.prototype.setDelay=function(l){this._opts.delay=l};h.prototype.getDelay=function(l){return this._opts.delay};h.prototype.setDuration=function(l){this._opts.duration=l};h.prototype.getDuration=function(l){return this._opts.duration};h.prototype.enableOverallView=function(){this._opts.overallView=true};h.prototype.disableOverallView=function(){this._opts.overallView=false};h.prototype.setPolyline=function(l){this._polyline=l;this._totalPath=l.getPath()};h.prototype.getPolyline=function(){return this._polyline};h.prototype.getLastPoint=function(){return[this._last2Points[0],this._last2Points[3]]}})();
```

把这个文件放到存放静态地图包的位置里，并在对应的加载文件里面引入。我这里的是 `map_load.js`

```js
// 地图API主目录
var JS__FILE__ = document.currentScript ? document.currentScript.src : document.scripts[document.scripts.length - 1].src;
offmapcfg.home = JS__FILE__.substr(0, JS__FILE__.lastIndexOf("/") + 1);
(function () {
  window.BMap_loadScriptTime = (new Date).getTime();
//   加载地图API主文件
  document.write('<script type="text/javascript" src="' + offmapcfg.home + 'bmapgl.min.js"></script>');
//   此处引入轨迹功能
  document.write('<script type="text/javascript" src="' + offmapcfg.home + '/tools/TrackAnimation.min.js"></script>');
})();
```

### 主要代码

到这一步，你的文件引入基本就搞定了，可以在项目里使用轨迹函数了。

下面代码中提供了封装好的 `getLineAnimation` 方法，只需要往里面传轨迹点位参数即可，同时也可以在父组件里通过 `this.$refs['xxx'].getLineAnimation(list)` 来实现方法的调用。

```html
<!-- 百度离线地图 -->
<template>
  <div class="map" style="height: 100%">
    <div style="position: relative; height: 100%">
      <div id="main" style="width: 100%; height: 100%"></div>
      <span class="BMapLib_clear"></span>
    </div>
  </div>
</template>

<script>
import { debounce, throttle } from "@/utils/optimize";
let map = null;
export default {
  name: "el-map-offline",
  components: {},
  props: {
    // 中心点x轴坐标，默认为深圳北站坐标
    centerXAxis: {
      type: String,
      default: "113.9784504635121",
    },
    centerYAxis: {
      type: String,
      default: "22.540276392608142",
    },
    zoom: {
      type: [String, Number],
      default: 15,
    },
  },
  data() {
    return {
      tempList: [
        { lng:  113.96321513233588, lat: 22.53860961189129 },
        {lng:113.9650707666733,lat:22.53843370693047,},
        {lng:113.96775954295815,lat:22.538046715218638},
        {lng:113.97059979959708,lat:22.53765972240953,},
        {lng:113.97052405942006,lat:22.54147683078636,},
        {lng:113.97328857588194,lat:22.541283339382137,},
        {lng:113.97345899128027,lat:22.545223473885166,},
        {lng:113.98071111323165,lat:22.542971982386284,},
        {lng:113.98873957199773,lat:22.539752988610463,},
      ],
    };
  },
  mounted() {},
  methods: {
    init() {
      let that = this;
      map = new BMapGL.Map("main", { enableMapClick: false });
      this.$emit("getMap", map); // 传给父组件
      // 初始化地图，设置中心点坐标和地图级别
      map.centerAndZoom(
        new BMapGL.Point(this.centerXAxis, this.centerYAxis),
        this.zoom
      );
      map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      map.disableDoubleClickZoom(false); // 禁止地图双击放大

      // 添加比例尺控件
      var scaleCtrl = new BMapGL.ScaleControl({
        // anchor: BMAP_ANCHOR_TOP_LEFT,
        anchor: BMAP_ANCHOR_BOTTOM_LEFT,
        // offset: new BMapGL.Size(100, 65),
      });

      map.addControl(scaleCtrl);
      // 开启路况
      //  map.setTrafficOn();
      // 关闭路况
      //  map.setTrafficOff();
      // 监听地图缩放事件
      map.addEventListener(
        "zoomend",
        debounce(function (e) {
          that.$emit("returnZoom", e.target.zoomLevel);
        }, 100)
      );

      // 监听地图拖拽事件
      map.addEventListener("dragend", function (e) {});

      // 监听地图点击事件
      map.addEventListener("click", function (e) {});

      // 监听地图双击事件
      // map.addEventListener("dblclick", (e) => {
      // that.getAroundAxis();
      // });
      this.$nextTick(() => {
         this.getLineAnimation(this.tempList);
      });
    },
    // 切换中心点
    changeCenter(xAxis, yAxis, zoom) {
      map.centerAndZoom(
        new BMapGL.Point(xAxis, yAxis),
        zoom ? zoom : this.zoom
      );
    },

    // 删除全部
    deleteAll() {
      map.clearOverlays();
    },

    getLineAnimation(list) {
      var path = list
      var point = [];
      for (var i = 0; i < path.length; i++) {
        point.push(new BMapGL.Point(path[i].lng, path[i].lat));
      }
      var pl = new BMapGL.Polyline(point);
      var trackAni = new BMapGLLib.TrackAnimation(map, pl, {
        overallView: true, // 动画完成后自动调整视野到总览
        tilt: 55, // 轨迹播放的角度，默认为55
        duration: 20000, // 动画持续时长，默认为10000，单位ms
        delay: 500, // 动画开始的延迟，默认0，单位ms
      });
      trackAni.start();
    },
  },
  beforeDestroy() {
    console.log("销毁=====================");
    if (map) {
      map.destroy();
      map = null;
    }
  },
};
</script>

<style>
.ripple {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  animation: rippler 2s linear infinite;
  transform-origin: center;
}
@-webkit-keyframes rippler {
  0% {
    width: 30px;
    height: 30px;
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes rippler {
  0% {
    width: 30px;
    height: 30px;
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
/* 地图样式 */
.anchorBL {
  /* 隐藏百度地图logo */
  display: none;
  /* opacity: 0; */
}

.BMap_cpyCtrl {
  display: none;
}

.BMap_scaleCtrl {
  display: block;
}

.BMapGLLib_Drawing {
  top: 52px !important;
}

.BMapGLLib_Drawing_panel {
  height: 36px;
  border: none;
  background: #fff;
  border-radius: 2px;
}

.BMapGLLib_Drawing .BMapGLLib_box {
  width: 36px;
}

.BMapGLLib_Drawing .BMapGLLib_hander {
  background: url("~@/assets/images/map/move.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_marker {
  background: url("~@/assets/images/map/location.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_circle {
  background: url("~@/assets/images/map/circle.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_polyline {
  background: url("~@/assets/images/map/line.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_polygon {
  background: url("~@/assets/images/map/polygon.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_rectangle {
  background: url("~@/assets/images/map/rectangle.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_hander_hover {
  background: #d4ebfe url("~@/assets/images/map/move.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_marker_hover {
  background: #d4ebfe url("~@/assets/images/map/location.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_circle_hover {
  background: #d4ebfe url("~@/assets/images/map/circle.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_polyline_hover {
  background: #d4ebfe url("~@/assets/images/map/line.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_polygon_hover {
  background: #d4ebfe url("~@/assets/images/map/polygon.svg") no-repeat center;
  background-size: 22px 22px;
}

.BMapGLLib_Drawing .BMapGLLib_rectangle_hover {
  background: #d4ebfe url("~@/assets/images/map/rectangle.svg") no-repeat center;
  background-size: 22px 22px;
}
</style>

<style lang='scss' scoped>
// 地图工具箱
// .BMapLib_clear {
//   display: none;
//   position: absolute;
//   right: 17.61%;
//   top: 6.03%;
//   cursor: pointer;
//   border-top-left-radius: 2px;
//   border-bottom-left-radius: 2px;
//   width: 36px;
//   height: 36px;
//   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
//   border-right: 1px solid #d2d2d2;
//   background: #fff url("~@/assets/images/map/clear.svg") no-repeat center;
//   background-size: 22px 22px;
// }

// .BMapLib_clear_hover {
//   background: #d4ebfe url("~@/assets/images/map/clear.svg") no-repeat center;
//   background-size: 22px 22px;
// }
.map {
  position: relative;

  .hoverInfo {
    position: absolute;
    min-width: 100px;
    height: 30px;
    text-align: center;
    background-color: #fff;
    z-index: 500;
    border-radius: 5px;
    line-height: 30px;
    font-size: 14px;
    padding: 0 5px;

    .title {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  .animation-class {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgba(62, 154, 230, 0.2);
    background-color: rgba(20, 78, 240, 0.2);
    animation: spreadOne 1s alternate infinite;
  }

  @keyframes spreadOne {
    0% {
      // top: calc((100% - 30px)/2);
      // left: calc((100% - 30px)/2);
      width: 30px;
      height: 30px;
    }

    100% {
      // top: calc((100% - 50px)/2);
      // left: calc((100% - 50px)/2);
      transform: translate(-10px, -10px);
      width: 50px;
      height: 50px;
    }
  }

  #tool {
    position: absolute;
    right: 410px;
    top: 0;
    cursor: pointer;
    z-index: 100;

    > p {
      position: relative;
      height: 36px;
      width: 36px;
      border-radius: 3px;
      background: #fff;
      text-align: center;
      line-height: 36px;

      img:last-child {
        position: absolute;
        bottom: 1px;
        left: 15px;
      }
    }
  }

  .delete-box {
    position: absolute;
    height: 30px;
    width: 60px;
    padding: 0 5px;
    line-height: 30px;
    background-color: #fff;
    font-size: 12px;
    border: 1px solid lightgray;
    border-radius: 5px;
    z-index: 9999;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 0 10px lightgray;
  }
}

// ::v-deep .BMapLabel {
//   background-color: transparent !important;
// }
</style>
```