---
title: three.js安装与使用
date: '2023-10-16'
summary: ''
draft: false
tags: ['vue2','three.js']
canonicalUrl: ''
---

之前因为项目需求，需要做三维可视化大屏，着手研究了 `three.js`，近期有空整理一下。

### 介绍

[`Three.js`](http://www.webgl3d.cn/) 是一个基于 `JavaScript` 编写的开源 3D 图形库，利用 WebGL 技术在网页上渲染 3D 图形。它提供了许多高级功能，如几何体、纹理、光照、阴影等，以便开发者能够快速地创建复杂且逼真的 3D 场景。


### 安装与引入

#### 使用npm安装

```js-nolint
$ npm i three
```

#### 引入

在对应的文件中引入即可

```js
<script>
import * as THREE from "three";
</script>
```

### 使用

#### 声明变量

在 `vue` 中使用 `three.js` 要注意的是关于变量的声明，需要将变量声明在 `data()` 之外，否则会十分的卡。

```js
import * as THREE from "three";

// 定义场景
const scene = new THREE.Scene();
// three的控制器必须放在data外，否则会造成卡顿的问题
var controls;
var camera;
var renderer;
```

#### 创建场景

在前面的准备工作做好之后，我们需要做的就是创建[场景](http://www.yanhuangxueyuan.com/threejs/docs/index.html?q=scene#api/zh/scenes/Scene)并赋予相关属性。场景能够让你在什么地方、摆放什么东西来交给three.js来渲染，这是你放置物体、灯光和摄像机的地方。

```js
// 定义场景
const scene = new THREE.Scene();

...

createScene() {
  scene.background = new THREE.Color("#172333");
},
```

#### 导入模型

在场景相关属性配置好之后，我们需要把对应[模型](http://www.yanhuangxueyuan.com/threejs/docs/index.html#manual/zh/introduction/Loading-3D-models)给导入。模型的格式有很多种，如果有可能的话，推荐使用 `glTF`（gl 传输格式）。`.GLB` 和 `.GLTF` 是这种格式的这两种不同版本， 都可以被很好地支持。由于 `glTF` 这种格式是专注于在程序运行时呈现三维物体的，所以它的传输效率非常高，且加载速度非常快。 功能方面则包括了网格、材质、纹理、皮肤、骨骼、变形目标、动画、灯光和摄像机。不过项目中我使用的是 `.fbx` 格式，这里也是以此为例。

```js
data() {
  return {
    publicPath: process.env.BASE_URL,
  };
},
```

```js
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

...

createModel() {
  const loader = new FBXLoader();
  // 加载fbx文件
  loader.load(
    this.publicPath + "static/demo/demo.fbx",
    (model) => {
      model.scale.set(1, 1, 1);
      // 将模型添加到场景中
      scene.add(model);
    },
    (event) => {},
    (error) => {
      // 控制台打印加载失败
      console.error(error);
    }
  );
},
```

这里的模型导入也可以导入服务器上的 url，这里使用 `this.publicPath + "static/demo/demo.fbx"` 也是为了本地调试，后期是更改成后端返回的服务器 url 地址。

#### 创建光源

紧接着我们创建光源，使场景内变得不那么阴暗。

```js
createLight() {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 2); // 创建环境光
  scene.add(ambientLight); // 将环境光添加到场景
  const spotLight = new THREE.SpotLight(0xffffff, 1, 0); // 创建聚光灯
  spotLight.position.set(1000, 1000, 1000);
  spotLight.castShadow = true;
  scene.add(spotLight);
},
```

#### 创建相机

光源创建好之后，我们可以设立我们的相机了。相机同样分了很多种，这里使用的是[透视相机](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/cameras/PerspectiveCamera)。

```html
<template>
  <div class="three-model" id="container"></div>
</template>
```

```js
createCamera() {
  const element = document.getElementById("container");
  const width = element.offsetWidth; // 窗口宽度
  const height = element.offsetHeight; // 窗口高度
  const k = width / height; // 窗口宽高比
  camera = new THREE.PerspectiveCamera(35, k, 0.1, 99999999);
  camera.position.set(300, 300, -300); // 设置相机位置
  camera.lookAt(new THREE.Vector3(10, 40, 0)); // 设置相机方向
  scene.add(camera);
},
```

#### 创建渲染器

之前设立的所有要素，都需要通过渲染器来将画面渲染到页面中，这里使用的是 [`WebGLRenderer`](http://www.yanhuangxueyuan.com/threejs/docs/index.html?q=WebGLRenderer#api/zh/renderers/WebGLRenderer)

```js
createRender() {
  const element = document.getElementById("container");
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
  renderer.shadowMap.enabled = true; // 显示阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  element.appendChild(renderer.domElement);
},
```

#### 创建控制器

如果想要对画面中的模型进行移动、缩放、旋转的操作的话，需要创建控制器，这里使用了[轨道控制器](http://www.yanhuangxueyuan.com/threejs/docs/index.html?q=OrbitControls#examples/zh/controls/OrbitControls)

```js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

...

createControls() {
  controls = new OrbitControls(camera, renderer.domElement);
},
```

#### 渲染

最后一步，就是调用渲染函数，对画面进行渲染

```js
render() {
  requestAnimationFrame(this.render);
  renderer.render(scene, camera);
  controls.update();
},
```

### 完整代码

```html
<template>
  <div class="three-model" id="container"></div>
</template>

<script>
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 定义场景
const scene = new THREE.Scene();
// three的控制器必须放在data外，否则会造成卡顿的问题
var controls;
var camera;
var renderer;

export default {
  name: "three-model",
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.createScene(); // 创建场景
      this.createModel(); // 导入模型
      this.createLight(); // 创建光源
      this.createCamera(); // 创建相机
      this.createRender(); // 创建渲染器
      this.createControls(); // 创建控件对象
      this.render();
      // 监听画面变化，更新渲染画面
      window.addEventListener("resize", () => {
        //   console.log("画面变化了");
        // 更新摄像头
        camera.aspect = window.innerWidth / window.innerHeight;
        //   更新摄像机的投影矩阵
        camera.updateProjectionMatrix();

        //   更新渲染器
        renderer.setSize(window.innerWidth, window.innerHeight);
        //   设置渲染器的像素比
        renderer.setPixelRatio(window.devicePixelRatio);
      });
    },
    createScene() {
      scene.background = new THREE.Color("#172333");
    },
    createModel() {
      const loader = new FBXLoader();
      // 加载fbx文件
      loader.load(
        this.publicPath + "static/demo/demo.fbx",
        (model) => {
          model.scale.set(1, 1, 1);
          // 将模型添加到场景中
          scene.add(model);
        },
        (event) => {},
        (error) => {
          // 控制台打印加载失败
          console.error(error);
        }
      );
    },
    createLight() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 2); // 创建环境光
      scene.add(ambientLight); // 将环境光添加到场景
      const spotLight = new THREE.SpotLight(0xffffff, 1, 0); // 创建聚光灯
      spotLight.position.set(1000, 1000, 1000);
      spotLight.castShadow = true;
      scene.add(spotLight);
    },
    createCamera() {
      const element = document.getElementById("container");
      const width = element.offsetWidth; // 窗口宽度
      const height = element.offsetHeight; // 窗口高度
      const k = width / height; // 窗口宽高比
      camera = new THREE.PerspectiveCamera(35, k, 0.1, 99999999);
      camera.position.set(300, 300, -300); // 设置相机位置
      camera.lookAt(new THREE.Vector3(10, 40, 0)); // 设置相机方向
      scene.add(camera);
    },
    createRender() {
      const element = document.getElementById("container");
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(element.clientWidth, element.clientHeight); // 设置渲染区域尺寸
      renderer.shadowMap.enabled = true; // 显示阴影
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      element.appendChild(renderer.domElement);
    },
    createControls() {
      controls = new OrbitControls(camera, renderer.domElement);
    },
    render() {
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
      controls.update();
    },
  },
};
</script>

<style lang="scss" scoped>
.three-model {
  width: 100%;
  height: 100%;
}
</style>
```