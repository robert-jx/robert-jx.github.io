---
title: vuedraggable
date: '2023-05-12'
summary: vuedraggable实现表格拖拽
draft: false
tags: ['vue2','vuedraggable']
canonicalUrl: ''
---

### vuedraggable实现表格拖拽

#### 引入

首先下载依赖包 `npm install vuedraggable -S`

```js-nolint
npm install vuedraggable -S
```

#### 使用

```html
<template>
    <div class="demo">
        <table class="dataTabble">
            <thead>
                <tr>
                    <th width="110">序号</th>
                    <th width="200">内容</th>
                    <th width="160">操作</th>
                /tr>
            </thead>
            <draggable v-model="demoList" element="tbody" :move="getData" @update="dragData">
                <tr v-for="(item,id) in demoList" :key="id">
                    <td>{{id}}</td>
                    <td>{{item.content}}</td>
                    <td>
                        <div class="tabopa">
                            <a @click="addForm" style="cursor:pointer">添加</a>
                            <a @click="delete">删除</a>
                        </div>
                    </td>
                </tr>
            </draggable>
        </table>
    </div>
</template>
<script>
    import draggable from "vuedraggable"
    export default{
        name:'demo;,
        data(){
            return{
                demoList:[]
            }
        },
        components:{
            draggable 
        },
        created(){
        
        },
        methods:{
            //拖动中与拖动结束
            getData(evt) {
                console.log(evt.draggedContext.element.id);
            },
            dragData(evt) {
                console.log("拖动前 :" + evt.oldIndex);
                console.log("拖动后 :" + evt.newIndex);
            },
        }
    }
</script>
```
