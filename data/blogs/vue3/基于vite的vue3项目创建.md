---
title: 基于vite的vue3项目创建
date: '2023-05-16'
summary: 手把手创建基于vite的ts+vue3项目
draft: false
tags: ['vue3','vite','echarts','sass/scss','element-plus','router']
canonicalUrl: ''
---

随着 [`vite`](https://vitejs.cn/)、[`vue3`](https://cn.vuejs.org/) 以及 [`typescript`](https://www.typescriptlang.org/zh/) 的强强联手，越来越多的前端感受到其便利并开始进入学习。那么如何快速且全面的创建一个的 `vue3` 项目？这里做了一些总结：

### 创建项目

#### npm

```js-nolint
npm create vite@latest 
```

#### yarn

```js-nolint
yarn create vite
```

#### 输入项目名称

假如项目名称为：test

```js-nolint
Project name: » vite-project
```

#### 选择框架

按上下选择框架，选择 `vue` 然后回车

```js
√ Project name: ... test
? Select a framework: » - Use arrow-keys. Return to submit.
    Vanilla
>   Vue
    React
    Preact
    Lit
    Svelte
```

然后选择 `TypeScript`

```js
? Select a variant: » - Use arrow-keys. Return to submit.
    JavaScript
>   TypeScript
    Customize with create-vue
    Nuxt
```

创建完成，执行以下命令

```js
Done. Now run:
  cd test
  npm install
  npm run dev
```

### 安装 `scss` 和 `sass` 依赖

> **注意：**`vite` 它提供了对 `.scss`、`.sass`、`.less`、`.styl` 和 `.stylus` 文件的内置支持。但必须安装相应的预处理器依赖，国内一般只使用 less 或 scss。这里只安装 `scss` 和 `sass`。

```js-nolint
npm add -D sass 
```

### 安装 `router`

#### npm

```js-nolint
npm install vue-router@4 
```

#### yarn

```js-nolint
yarn add vue-router@4 
```

在 `main.ts` 文件中引入

```ts
import { createApp } from 'vue'
import App from './App.vue'
 
 //routes
 import router from "./routes/index"; 
 
const app= createApp(App)
 
 //routes 
 app.use(router)  
app.mount('#app')
```

在 `src` 下创建一个 `routes` 文件夹，再创建一个 `index.ts` 文件

```ts
import { createRouter, createWebHistory } from "vue-router";
 
 
let routes= [
    {
        path: '/',
        name: 'home',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/homeView.vue')
    },
    //{
        //配置404页面
        //path: '/:catchAll(.*)',
        //name: '404',
        //component: () => import(''),
    //}
]
// 路由
const router = createRouter({
    history: createWebHistory(),
    routes
})
// 导出
export default router
```

> **注意：** `router` 至此就安装好了，但是其它页面要自己配置，比如：404页面

### 安装 `axios`

#### 安装

```
npm install axios
```

#### 封装 `request`

先在 `src` 下创建一个 `request` 文件夹，并添加一个 `request.ts` 文件

```ts
import axios from 'axios'
// 创建axios实例
const request = axios.create({
    baseURL: '',// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout: 50000, // 请求超时时间(毫秒)
    withCredentials: true,// 异步请求携带cookie
    // headers: {
    // 设置后端需要的传参类型
    // 'Content-Type': 'application/json',
    // 'token': x-auth-token',//一开始就要token
    // 'X-Requested-With': 'XMLHttpRequest',
    // },
})
 
// request拦截器
request.interceptors.request.use(
    config => {
        // 如果你要去localStor获取token,(如果你有)
        let token = localStorage.getItem("token");
        if (token) {
                添加请求头
                config.headers["Authorization"]="Bearer "+ token
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)
 
// response 拦截器
request.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response.data
    },
    error => {  
        // 对响应错误做点什么
        return Promise.reject(error)
    }
)
export default request
```

### 设置 `@` 别名

现在 `vite.config.ts` 文件中设置

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
 // 配置@别名
 import { resolve } from "path"; 
 
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
      // ↓解析配置
    resolve: {
      // ↓路径别名
      alias: {
        "@": resolve(__dirname, "./src")
      }
    }
})
```

接着在 `tsconfig.json` 中设置

```json
{
  "compilerOptions": {
    "target": "ESNext",
    ...
 
    // 配置@别名
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }, 
  },
}
```

> **注意：** 如果运行不了或报错试下安装下 `@types/node`

```
npm install @types/node
```

### 安装 `element-plus`

[`element-plus` 官方网址](https://element-plus.gitee.io/zh-CN/)

```
npm install element-plus --save
```

### 安装 `echarts`

```
npm install echarts --save
```
