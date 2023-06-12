---
title: axios使用总结
date: '2023-05-12'
summary: ''
draft: false
tags: ['vue2','axios']
canonicalUrl: ''
---

### axios 使用总结

`axios` 相信很多人都不陌生，它也是我接触前端以来常用的 `HTTP` 网络请求库。对于 `vue` 中如何安装和使用 `axios`，这里我做了些总结👇

#### 介绍

[`Axios`](https://www.w3cschool.cn/jquti/) 是一个基于 `Promise` 用于浏览器和 `nodejs` 的 `HTTP` 网络请求库，本质上也是对原生 `XHR` 的封装，只不过它是 `Promise` 的实现版本，符合最新的 `ES` 规范。

#### 安装

```js-nolint
npm install axios --save
// 或
bower install axios
```

也可以通过cdn引入

```js
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

#### 引用

在需要使用的页面或者 `main.js` 里面引用

```js
//在main.js里面引用
...
import axios from 'axios'
...
Vue.prototype.axios = axios;

new Vue({
    axios,
    router,
    store,
    render:h=>h(App)
}).$mount('#app')
```

#### 创建实例、请求拦截和响应拦截

在 `main.js` 中引入 `axios` 后，创建一个 `request.js` 文件，里面存放我们对于 `axios` 的一些封装。

```js
import axios from 'axios'

// 创建axios实例
const request = axios.create({
    baseURL: '',// 所有的请求地址前缀部分
    timeout: 5000, // 请求超时时间，单位为毫秒
    withCredentials: true,// 异步请求是否携带cookie
    headers: {
        // 设置后端需要的传参类型
        'Content-Type': 'application/json',
        'token': '此处放token',
        'X-Requested-With': 'XMLHttpRequest',
    },
})

// request拦截器
request.interceptors.request.use(
    config => {
        // 从localstorage获取token
        let token = localStorage.getItem("token");
        if (token) {
            //添加请求头
            config.headers["Authorization"] = "Bearer " + token
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
        // 对响应数据返回结果
        return response.data
    },
    error => {
        // 对响应错误返回结果
        return Promise.reject(error)
    }
)
export default request
```

#### 请求配置

这些是创建请求时可以用的配置选项。只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 `get` 方法。

```js
{
   // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // default

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },

   // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 在没有设置 `transformRequest` 时，必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求话费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,

   // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，以使测试更轻松
  // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

 // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
  // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

   // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `responseEncoding` indicates encoding to use for decoding responses
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // default

   // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

   // `onUploadProgress` 允许为上传处理进度事件
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  onDownloadProgress: function (progressEvent) {
    // 对原生进度事件的处理
  },

   // `maxContentLength` 定义允许的响应内容的最大尺寸
  maxContentLength: 2000,

  // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` 定义在 node.js 中 follow 的最大重定向数目
  // 如果设置为0，将不会 follow 任何重定向
  maxRedirects: 5, // default

  // `socketPath` defines a UNIX Socket to be used in node.js.
  // e.g. '/var/run/docker.sock' to send requests to the docker daemon.
  // Only either `socketPath` or `proxy` can be specified.
  // If both are specified, `socketPath` is used.
  socketPath: null, // default

  // `httpAgent` 和 `httpsAgent` 分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理。允许像这样配置选项：
  // `keepAlive` 默认没有启用
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' 定义代理服务器的主机名称和端口
  // `auth` 表示 HTTP 基础验证应当用于连接代理，并提供凭据
  // 这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` 指定用于取消请求的 cancel token
  // （查看后面的 Cancellation 这节了解更多）
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

#### 响应结构

某个请求的响应包含以下信息

```js
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 服务器响应的头
  headers: {},

   // `config` 是为请求提供的配置信息
  config: {},
 // 'request'
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
```

#### `GET` 方法

```js
 //没有参数的情况
getData(){
    this.axios.get('demourl').then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
},
//直接在url拼接参数的情况
getDataByQuery(){
    this.axios.get('demourl?id='+this.id).then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    });
},
//使用params来传参的情况
getDataByParams(){
    this.axios.get('demourl',{
        params:{
            id:1
        }
    }).then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    });
}
```

#### `POST` 方法

```js
//情况1，直接在里面赋值
postData(){
     this.axios.post('/user', {
         id: this.form.id,        // 参数 id
         name: this.form.name   // 参数 name
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
}
//情况2，调用本地对象
postDataByBody(){
     this.axios.post('/user',this.form).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
}
//情况3，通过封装出一个对象
postDataBySetBody(){
     let form = {
        id:1,
        name:'demo'
     }
     this.axios.post('/user',form).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
}
```

#### `PUT` 方法

```js
//直接在里面赋值
putData(){
     this.axios.post('/user', {
         id: this.form.id,        // 参数 id
         name: this.form.name   // 参数 name
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
}
```

#### `DELETE` 方法

```js
deleteData(){
    this.axios.delete('/user?id=1'
     ).then(function (response) {
       console.log(response);
     }).catch(function (error) {
       console.log(error);
     });
}
//使用params
deleteDataByParams(){
     this.axios.delete('/user', {
        params:{
            id:1
        }
      }).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
}
```
