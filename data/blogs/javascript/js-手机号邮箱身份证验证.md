---
title: js-手机号、邮箱、身份证验证
date: '2023-05-12'
summary: ''
draft: false
tags: ['javascript']
canonicalUrl: ''
---

### 使用正则进行手机号、邮箱、身份证验证

在使用 `element-ui` 中的[表单验证](https://element.eleme.cn/#/zh-CN/component/form)时，想给 `el-input` 添加一层验证。验证其手机号、邮箱、身份证是否输入正确，规则如下：

```js
rules: {    

    email: [

        { required: true, message: '请输入邮箱地址', trigger: 'blur' },

        {

            type: 'email',

            message: '请输入正确的邮箱地址',

            trigger: ['blur', 'change'],

        },

    ],

    mobile: [

        { required: true, message: '请输入手机号', trigger: 'blur' },

        {

           pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,

            message: '请输入正确的手机号码或者座机号',

        },

    ],

    mobile: [

        { required: true, message: '请输入手机号', trigger: 'blur' },

        {

           pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,

            message: '请输入正确的手机号码',

        },

    ],

    id_number: [

        {

            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,

            message: "请输入正确的身份证号码",

        },
    ],
    ip:[
         { required: true, pattern: /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/,message: "请输入正确的IP地址", trigger: "blur"}
    ]
}    
```
