---
title: vue2-二维码的生成及批量下载
date: '2023-04-07'
summary: 基于vue-qr的二维码生成
draft: false
tags: ['vue2','vue-qr','javascript']
canonicalUrl: ''
---
遇到个需求：要在某个表格中展示出二维码,并且要能够进行批量下载。通过一番学习，最后选择使用vue-qr来实现二维码展示效果，具体流程如下。

#### 安装vue-qr
这里我使用的是npm安装
```
npm install vue-qr --save
```
#### 引入vue-qr
在需要的页面导入，并在components里面注册
```
<script>
  import vueQr from "vue-qr"
  export default{
    name:"demo",
    data(){
      return{
        tableData:[
          {
            …
            url:"https://www.baidu.com"
          },
          …
        ]
      }
    },
    components:{
      vueQr
    }
  }
</script>

```
#### 使用组件
在对应的地方加入该组件
```
<vue-qr :option={size:200} :value="传的url"></vue-qr>
```
这个也可以封装成可复用的组件，只需传值即可，接下来便是批量下载

首先要实现批量导出二维码，得要安装jsZip和file-saver

#### 安装jsZip和file-saver
```
npm install jszip --save
npm install file-saver --save
```

#### 对应页面导入

```
<script>
import vueQr from 'vue-qr'
import JSZip from "jszip";
import FileSaver from "file-saver";

export default{
    name:'demo',
    data(){
        return{

        }
    },
    methods:{

    }

}
</script>
```

#### 点击按钮后调用函数下载
此处的主要思想就是，对页面当前所有的数据进行遍历赋值，之后再将qrFile拿去调用函数即可
```
<template>
    <div class="demo>
        ...
        <a-button @click="downLoadPicture"></a-button>
    </div>
</template>

<script>
export default{
    name:'demo',
    data(){
        return{
            demoList:[
                ...
            ],
            qrFile:[]
        }
    },
    methods:{
         // 批量导出二维码
        downLoadPicture() {
          if (this.demoList) {
            //遍历数据
            this.demoList.forEach(v => {
              this.qrFile.push({
                name: v.name,
                url: v.qrcode
              })
            })
            this.getUrl();
          }
          else {
            this.$message.error('当前没有可下载的二维码')
          }
        },
        getUrl() {

          const zip = new JSZip;
          this.qrFile.forEach(item => {
            const fileName = item.name + '.png';
            zip.file(fileName, item.url.substring(22), { base64: true }); //向zip中添加文件
          });
          zip.generateAsync({ type: "blob" }).then((content) => {
            // 生成二进制流
            FileSaver.saveAs(content, '批量导出' + "--二维码.zip"); // 利用file-saver保存文件
          });

          this.qrFile = [];
        },
    }

}


</script>
<style lang="scss" scoped>
.demo{}
</style>
```