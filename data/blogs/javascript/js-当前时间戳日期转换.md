---
title: js-当前时间戳、日期转换
date: '2023-06-12'
summary: ''
draft: false
tags: ['javascript']
canonicalUrl: ''
---

这里记载一些关于如何获取当前时间戳，以及时间戳和日期相互转换👇

### 获取当前时间戳

#### 第一种

```js
var timestamp = Date.parse(new Date());
console.log(timestamp);
```

#### 第二种

```js
var timestamp = (new Date()).valueOf();
console.log(timestamp);
```

#### 第三种

```js
new Date().getTime() ;
```

> **注意：** 第一种：获取的时间戳是把毫秒改成000显示，第二种和第三种是获取了当前毫秒的时间戳。

### 将时间戳转换成日期格式

```js
timestampToTime(timestamp) {
  // 时间戳为10位需*1000，时间戳为13位不需乘1000
  var date = new Date(timestamp * 1000);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h = date.getHours() + ":";
  var m = date.getMinutes() + ":";
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}
```

### 将日期格式转换成时间戳

```js
var date = new Date("2022-12-04 17:15:53:555");
// 有三种方式获取
var time1 = date.getTime();
var time2 = date.valueOf();
var time3 = Date.parse(date);
console.log(time1); //1670145353555
console.log(time2); //1670145353555
console.log(time3); //1670145353000
```

或者

```js
// 时间格式必须为  YYYY-MM-DD HH:MM:SS  或者 YYYY-MM-DD
let start_time  = "2023-06-12 16:50:30";
new Date(start_time).getTime()  // 使用上面三种均可以实现
```

### 相关时间日期方法

#### 获取当前日期时间

```js
let d =new Date();                         //不指定日期          默认返回“格林尼治”零时区日期
                                          //运行在浏览器中将使用浏览器的时区并将日期显示为全文本字符串
let time = new Date().getTimezoneOffset();//当前本地时间与“格林尼治”零时区的时间差，单位是分钟
let year=d.getFullYear();                 //返回当前年份        2022    2022年
let month=d.getMonth();                    //返回当前月份        3       4月
let date=d.getDate();                     //返回当前几号        22      22日
let day=d.getDay();                        //返回当前星期几      5       星期五
let hour=d.getHours();                     //返回时（0-23）      10      10时
let minutes=d.getMinutes();                //返回分（0-59）      6       六分
let seconds=d.getSeconds();                //返回秒（0-59）      32      32秒
let millseconds=d.getMilliseconds();       //返回毫秒（0-999）   266     266毫秒
```

#### 获取指定日期时间

```js
let d =new Date(2022,6,6,10,20);    //指定日期                    指定日期2022年7月6日10时20分
let year=d.getFullYear();           //返回指定日期年份            2022    2022年
let month=d.getMonth();             //返回指定日期月份            6       7月
let date=d.getDate();               //返回指定日期几号            6       6日
let day=d.getDay();                 //返回指定日期星期几          3       星期3
let hour=d.getHours();              //返回指定日期时（0-23）      10      10时
let minutes=d.getMinutes();         //返回指定日期分（0-59）      20      20分
let seconds=d.getSeconds();         //返回指定日期秒（0-59）      0    由于没有指定秒所以返回0
let millseconds=d.getMilliseconds();//返回指定日期毫秒（0-999）   0    由于没有指定毫秒所以返回0
```

#### 指定日期参数异常

```js
let d1 =new Date(2022,2,0);            //指定日期  指定日期2022年3月0日  
let d2 =new Date(2022,2,-1);           //指定日期  指定日期2022年3月-1日 
let d3 =new Date(2022,2,32);           //指定日期  指定日期2022年3月32日
let y1=d1.getMonth();                  //返回1   2月
let y2=d2.getMonth();                  //返回1   2月
let y3=d3.getMonth();                  //返回3   4月
let t1=d1.getDate();                   //返回28  28日
let t2=d2.getDate();                   //返回27  27日
let t3=d3.getDate();                   //返回1   1日
```

#### 日期获取方法总结

日期方法允许获取并设置日期值（年、月、日、时、分、秒、毫秒）

|       方法        |                 描述                 |
| :---------------: | :----------------------------------: |
|     getDate()     |         以数值返回天（1-31）         |
|     getDay()      |        以数值获取周名（0-6）         |
|   getFullYear()   |         获取四位的年（yyyy）         |
|    getHours()     |           获取小时（0-23）           |
| getMilliseconds() |          获取毫秒（0-999）           |
|   getMinutes()    |            获取分（0-59）            |
|    getMonth()     |            获取月（0-11）            |
|   getSeconds()    |            获取秒（0-59）            |
|     getTime()     | 获取时间（从 1970 年 1 月 1 日至今） |
