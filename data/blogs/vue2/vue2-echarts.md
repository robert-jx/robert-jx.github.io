---
title: vue2-echarts
date: '2023-04-07'
summary: '基于vue2的echarts常见三类图标的封装'
draft: false
tags: ['vue2','echarts','javascript']
canonicalUrl: ''
---
在近日的工作中，有需要用到echarts各种图表应对不同的场景的情况。因此抽空之余对几个比较常用的echarts图表进行了二次封装。开箱即用，只需要传入对应的参数即可。

因为项目中的侧边栏做了伸缩功能，平时的监听dom元素宽度变化在侧边栏伸缩时失效了。所以这里还引入了element-resize-detector库来实现图表自适应变化。

使用步骤如下：

1、安装element-resize-detector

```
npm i element-resize-detector -s
```

2、页面中引入
```
let elementResizeDetectorMaker = require("element-resize-detector");
```

3、在created里使用
```
//监听元素变化
      let erd = elementResizeDetectorMaker();
      let that = this;
      erd.listenTo(document.getElementById(this.id), function (element) {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.myChart.resize();
        });
      });
```
4、记得还需要在beforeDestroy中取消监听
```
beforeDestroy() {
    //监听元素变化
    let erd = elementResizeDetectorMaker();
    //离开页面删除检测器和所有侦听器
    erd.uninstall(this.$refs[this.id]); //这里用ref是因为vue离开页面后获取不到dom
  },
```

## 折线图封装代码
```
<template>
  <!-- 基础折线图 -->
  <div :ref="id" :id="id" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from "echarts";
let elementResizeDetectorMaker = require("element-resize-detector");

export default {
  name: "basic-line",
  props: {
    // 引入折线图要给容器命名id，以防重名导致渲染在同一容器
    id: {
      type: String,
      default: "line",
    },
    // 容器宽度
    width: {
      type: String,
      default: "600px",
    },
    // 容器高度
    height: {
      type: String,
      default: "200px",
    },
    // 悬浮面板展示的名称
    name: {
      type: String,
      default: "count",
    },
    // 标题
    title: {
      type: String,
      default: "",
    },
    // 单位
    unit: {
      type: String,
      default: "",
    },
    // 副标题
    subtext: {
      type: String,
      default: "",
    },
    // 标题位置
    titlePosition: {
      type: String,
      default: "left", // left center right
    },
    // 线条颜色
    colorList: {
      type: Array,
      default: () => ["#2785f8", "#26cd7d"],
    },
    // 线条粗细
    lineWidth: {
      type: Number,
      default: 2,
    },
    // 是否平滑
    smooth: {
      type: Boolean,
      default: false,
    },
    // 是否展示面积图
    isArea: {
      type: Boolean,
      default: false,
    },
    // 是否展示legend
    isLegend: {
      type: Boolean,
      default: false,
    },
    // 标签是否与坐标轴对齐
    boundaryGap: {
      type: Boolean,
      default: false,
    },
    // legend图标
    icon: {
      type: String,
      default: "",
    },
    // 工具栏
    isToolBox: {
      type: Boolean,
      default: false,
    },
    // 下载图片的名称
    pictureName: {
      type: String,
      default: "echarts",
    },
    // 空为空心，circle为小圆点
    symbol: {
      type: String,
      default: "circle",
    },
    // 圆点大小
    symbolSize: {
      type: Number,
      default: 7,
    },
    // 透明度
    opacity:{
      type:Number,
      default:0.65
    },
    // 是否渐变
    isLinear:{
      type:Boolean,
      default:false
    },
    // 数据
    dataList: {
      type: Array,
      default: () => [
        {
          name: "联动日志",
          data: [10, 20, 24, 18, 15, 47, 60],
        },

        {
          name: "系统日志",
          data: [50, 230, 22, 218, 135, 17, 60],
        },
      ],
    },
    // x轴字段展示，例如：日期
    timeLabel: {
      type: Array,
      default: () => ["3/8", "3/9", "3/10", "3/11", "3/12", "3/13", "3/14"],
    },
    // 如果数据有变化就使setChange变false再变true，这里直接监听该字段来初始化
    isChange: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myChart: "",
    };
  },
  watch: {
    isChange: {
      handler(val) {
        if (val) {
          this.init();
        }
      },
      immediate: true,
    },
    dataList: {
      handler() {
        this.init();
      },
    },
  },
  created() {},
  mounted() {
    // 初始化
    this.init();
    this.watchSize();
  },
  methods: {
    // 初始化
    init() {
      var chartDom = document.getElementById(this.id);
      this.myChart = echarts.init(chartDom);
      var option;
      var unit = this.unit;
      option = {
        // 标题
        title:
          this.title != ""
            ? {
                text: this.title + this.unit,
                subtext: this.subtext,
                left: this.titlePosition,
              }
            : null,

        legend: this.isLegend
          ? {
              bottom: "2%",
              left: "center",
              icon: this.icon != "" ? this.icon : null,
              itemHeight: 10, // 修改icon图形大小
              itemGap: 24, // 修改间距
              textStyle: {
                fontSize: 12,
              },
            }
          : null,
        // 工具栏
        toolbox: {
          show: this.isToolBox,
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ["line", "bar"] },
            // restore: { show: true },
            saveAsImage: { show: true, name: this.pictureName },
          },
        },
        // 折线图位置
        grid: {
          left: "3%",
          right: "4%",
          bottom: this.isLegend ? "15%" : "3%",
          top: "15%",
          containLabel: true,
        },
        // 悬浮面板
        tooltip: {
          trigger: "axis",
          // 添加单位
          formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" +
                params[i].marker +
                params[i].seriesName +
                " : " +
                params[i].value +
                unit;
            }
            return relVal;
          },
        },
        // x轴
        xAxis: {
          type: "category",
          boundaryGap: this.boundaryGap,
          data: this.timeLabel,
        },
        // y轴
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}" + this.unit,
          },
        },
        // 数据内容相关
        series: this.dataList.map((v, index) => {
          return {
            // 名称
            name: v.name,
            // 数据
            data: v.data,
            // 是否平滑
            smooth: this.smooth,
            symbol: this.symbol, //将小圆点改成实心 不写symbol默认空心
            symbolSize: this.symbolSize, //小圆点的大小
            type: "line",
            // 折线图内容样式
            itemStyle: {
              normal: {
                color: this.colorList[index],
                lineStyle: {
                  color: this.colorList[index],
                  width: this.lineWidth,
                },
              },
            },
            // 面积样式
            areaStyle: this.isArea
              ? {
                  normal: {
                    color:this.isLinear? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: this.colorList[index],
                      },
                      {
                        offset: 1,
                        color: "rgba(0,0,0,0)",
                      },
                    ]):null,

                    opacity: this.opacity,
                  },
                }
              : null,
          };
        }),
      };

      option && this.myChart.setOption(option);
    },
    // 监听size
    watchSize() {
      //监听元素变化
      let erd = elementResizeDetectorMaker();
      let that = this;
      erd.listenTo(document.getElementById(this.id), function (element) {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.myChart.resize();
        });
      });
    },
  },
  beforeDestroy() {
    //监听元素变化
    let erd = elementResizeDetectorMaker();
    //离开页面删除检测器和所有侦听器
    erd.uninstall(this.$refs[this.id]); //这里用ref是因为vue离开页面后获取不到dom
  },
};
</script>

<style>
</style>
```

## 柱状图封装代码
```
<template>
  <!-- 基础柱状图 -->
  <div :ref="id" :id="id" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from "echarts";
let elementResizeDetectorMaker = require("element-resize-detector");

export default {
  name: "basic-bar",
  props: {
    // 引入柱状图要给容器命名id，以防重名导致渲染在同一容器
    id: {
      type: String,
      default: "bar",
    },
    // 容器宽度
    width: {
      type: String,
      default: "600px",
    },
    // 容器高度
    height: {
      type: String,
      default: "200px",
    },
    // 悬浮面板展示的名称
    name: {
      type: String,
      default: "count",
    },
    // 标题
    title: {
      type: String,
      default: "",
    },
    // 单位
    unit: {
      type: String,
      default: "",
    },
    // 副标题
    subtext: {
      type: String,
      default: "",
    },
    // 标题位置
    titlePosition: {
      type: String,
      default: "left", // left center right
    },
    // 线条颜色
    colorList: {
      type: Array,
      default: () => ["#4798f9", "#26cd7d", "#fcd95f"],
    },
    // 标签是否与坐标轴对齐
    alignWithLabel: {
      type: Boolean,
      default: true,
    },
    // 是否横向
    isBroadwise: {
      type: Boolean,
      default: false,
    },
    // 是否堆叠
    isStack: {
      type: Boolean,
      default: false,
    },
    // 是否展示legend
    isLegend: {
      type: Boolean,
      default: true,
    },
    // legend图标
    icon: {
      type: String,
      default: "",
    },
    // 工具栏
    isToolBox: {
      type: Boolean,
      default: false,
    },
    // 下载图片的名称
    pictureName: {
      type: String,
      default: "echarts",
    },
    // 是否展示markline
    isMarkLine: {
      type: Boolean,
      default: false,
    },
    // 柱子宽度
    barWidth:{
      type:String,
      default:'11%'
    },
    // 柱子最大宽度
    barMaxWidth:{
      type:String,
      default:'11%'
    },
    // 数据
    dataList: {
      type: Array,
      default: () => [
        {
          name: "add",
          data: [1000, 1200, 1119, 1305, 800, 959, 1150],
        },
        {
          name: "edit",
          data: [500, 789, 650, 908, 666, 588, 929],
        },
        {
          name: "delete",
          data: [80, 122, 78, 148, 45, 96, 99],
        },
      ],
    },
    // x轴字段展示，例如：日期
    timeLabel: {
      type: Array,
      default: () => ["3/8", "3/9", "3/10", "3/11", "3/12", "3/13", "3/14"],
    },
    // 如果数据有变化就使setChange变false再变true，这里直接监听该字段来初始化
    isChange: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myChart: "",
    };
  },
  watch: {
    isChange: {
      handler(val) {
        if (val) {
          this.init();
        }
      },
      immediate: true,
    },
    dataList: {
      handler() {
        this.init();
      },
    },
  },
  created() {},
  mounted() {
    // 初始化
    this.init();
    this.watchSize();
  },
  methods: {
    // 初始化
    init() {
      var chartDom = document.getElementById(this.id);
      this.myChart = echarts.init(chartDom);
      var option;
      var unit = this.unit;

      option = {
        // 标题
        title:
          this.title != ""
            ? {
                text: this.title + this.unit,
                subtext: this.subtext,
                left: this.titlePosition,
              }
            : null,

        legend: this.isLegend
          ? {
              bottom: "2%",
              left: "center",
              icon: this.icon != "" ? this.icon : null,
              itemHeight: 10, // 修改icon图形大小
              itemGap: 24, // 修改间距
              textStyle: {
                fontSize: 12,
              },
            }
          : null,

        // 工具栏
        toolbox: {
          show: this.isToolBox,
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ["line", "bar"] },
            // restore: { show: true },
            saveAsImage: { show: true, name: this.pictureName },
          },
        },
        // 柱状图位置
        grid: {
          left: "3%",
          right: "4%",
          bottom: this.isLegend ? "15%" : "5%",
          top: "10%",
          containLabel: true,
        },
        // 悬浮面板
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          // 添加单位
          formatter: function (params) {
            var relVal = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                "<br/>" +
                params[i].marker +
                params[i].seriesName +
                " : " +
                params[i].value +
                unit;
            }
            return relVal;
          },
        },
        // x轴
        xAxis: {
          type: "category",
          data: this.timeLabel,
          axisTick: {
            alignWithLabel: this.alignWithLabel,
          },
        },
        // y轴
        yAxis: {
          type: "value",
        },
        // 内容
        series: this.dataList.map((v, index) => {
          return {
            name: v.name,
            data: v.data,
            stack: this.isStack ? "Ad" : null,
            type: "bar",
            itemStyle: {
              color: this.colorList[index],
            },

            markLine: this.isMarkLine
              ? {
                  lineStyle: {
                    type: "dashed",
                  },
                  data: [[{ type: "min" }, { type: "max" }]],
                }
              : null,
              barWidth:this.barWidth,
              barMaxWidth:this.barMaxWidth
          };
        }),
      };
      //   判断是否堆叠
      if (this.isBroadwise) {
        let xAxis = option.xAxis;
        let yAxis = option.yAxis;
        option.xAxis = yAxis;
        option.yAxis = xAxis;
      }
      option && this.myChart.setOption(option);
    },
    // 监听size
    watchSize() {
      //监听元素变化
      let erd = elementResizeDetectorMaker();
      let that = this;
      erd.listenTo(document.getElementById(this.id), function (element) {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.myChart.resize();
        });
      });
    },
  },
  beforeDestroy() {
    //监听元素变化
    let erd = elementResizeDetectorMaker();
    //离开页面删除检测器和所有侦听器
    erd.uninstall(this.$refs[this.id]); //这里用ref是因为vue离开页面后获取不到dom
  },
};
</script>

<style>
</style>
```

## 饼图封装代码
```
<template>
  <!-- 饼图 -->
  <div :ref="id" :id="id" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from "echarts";
let elementResizeDetectorMaker = require("element-resize-detector");

export default {
  name: "basic-pie",
  props: {
    // 引入柱状图要给容器命名id，以防重名导致渲染在同一容器
    id: {
      type: String,
      default: "pie",
    },
    // 容器宽度
    width: {
      type: String,
      default: "600px",
    },
    // 容器高度
    height: {
      type: String,
      default: "200px",
    },
    // 悬浮面板展示的名称
    name: {
      type: String,
      default: "",
    },
    // 标题
    title: {
      type: String,
      default: "",
    },
    // 单位
    unit: {
      type: String,
      default: "",
    },
    // 副标题
    subtext: {
      type: String,
      default: "",
    },
    // 标题位置
    titlePosition: {
      type: String,
      default: "left", // left center right
    },
    // 是否环形，默认否
    isAnnular: {
      type: Boolean,
      default: false,
    },
    // 环形内圈
    annularMin: {
      type: String,
      default: "40%",
    },
    // 环形外圈
    annularMax: {
      type: String,
      default: "70%",
    },
    // 是否展示legend
    isLegend: {
      type: Boolean,
      default: true,
    },
    // 线条颜色
    colorList: {
      type: Array,
      default: () => ["#4798f9", "#26caca", "#26cd7d"],
    },
    // legend图标
    icon: {
      type: String,
      default: "",
    },
    // 工具栏
    isToolBox: {
      type: Boolean,
      default: false,
    },
    // 下载图片的名称
    pictureName:{
      type:String,
      default:'echarts'
    },
    // 默认大小
    radius:{
      type:String,
      default:'50%'
    },
    // 数据
    dataList: {
      type: Array,
      default: () => [
        { value: 1048, name: "添加" },
        { value: 735, name: "编辑" },
        { value: 580, name: "删除" },
      ],
    },
    // 如果数据有变化就使setChange变false再变true，这里直接监听该字段来初始化
    isChange: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myChart: "",
    };
  },
  watch: {
    isChange: {
      handler(val) {
        if (val) {
          this.init();
        }
      },
      immediate: true,
    },
    dataList: {
      handler() {
        this.init();
      },
    },
  },
  created() {},
  mounted() {
    // 初始化
    this.init();
    this.watchSize();
  },
  methods: {
    // 初始化
    init() {
      var chartDom = document.getElementById(this.id);
      this.myChart = echarts.init(chartDom);
      var option;

      option = {
        // 标题
        title:
          this.title != ""
            ? {
                text: this.title + this.unit,
                subtext: this.subtext,
                left: this.titlePosition,
              }
            : null,
        // 饼图位置
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "4%",
          containLabel: true,
        },
        // 悬浮面板
        tooltip: {
          trigger: "item",
        },
        // 工具栏
        toolbox: {
          show: this.isToolBox,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            // restore: { show: true },
            saveAsImage: { show: true,name:this.pictureName },
          },
        },
        legend: this.isLegend
          ? {
              bottom: "5%",
              left: "center",
              icon: this.icon != "" ? this.icon : null,
              itemHeight: 10, // 修改icon图形大小
              itemGap: 24, // 修改间距
              textStyle: {
                fontSize: 12,
              },
            }
          : null,
        // 颜色-数组
        color: this.colorList,
        // 内容
        series: [
          {
            name: this.name != "" ? this.name : null,
            type: "pie",
            // 环形、圆形
            radius: this.isAnnular ? [this.annularMin, this.annularMax] : this.radius,
            data: this.dataList,
            // 间隔线
            itemStyle: {
              borderRadius: 0,
              borderColor: "#fff",
              borderWidth: 2,
            },
            // 引导线
            label: {
              show: true,
              position: "outside",
              // 数据+百分比展示
              formatter: "{b}：{d}%\n",
            },
          },
        ],
      };

      option && this.myChart.setOption(option);
    },

    // 监听size
    watchSize() {
      //监听元素变化
      let erd = elementResizeDetectorMaker();
      let that = this;
      erd.listenTo(document.getElementById(this.id), function (element) {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.myChart.resize();
        });
      });
    },
  },

  beforeDestroy() {
    //监听元素变化
    let erd = elementResizeDetectorMaker();
    //离开页面删除检测器和所有侦听器
    erd.uninstall(this.$refs[this.id]); //这里用ref是因为vue离开页面后获取不到dom
  },
};
</script>

<style>
</style>
```


