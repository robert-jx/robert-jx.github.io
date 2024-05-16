---
title: vue3-三维地图的实现
date: '2024-05-16'
summary: ''
draft: false
tags: ['vue3','typescript','threejs','d3','vite','gis']
canonicalUrl: ''
---

最近看到网上各种三维地图的效果，也想着学习一下。因此记录一下学习路程。

### 创建项目

这里使用的 `vite` 搭建的 `vue3` 项目，具体操作可以参考我之前的博客：

[【基于vite的vue3项目创建】](https://robert-jx.github.io/blogs/vue3/%E5%9F%BA%E4%BA%8Evite%E7%9A%84vue3%E9%A1%B9%E7%9B%AE%E5%88%9B%E5%BB%BA)

### 安装与引入

项目的基础搭建完毕之后，需要的就是引入 `three.js` 和 `d3`

```js-nolint
npm install three
npm install d3
```

安装完毕之后需要在对应的页面进行引入

```ts
import * as THREE from 'three';
import * as d3 from 'd3';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

### 准备地图JSON

做三维地图，需要使用地图的 json 数据，这里可以用阿里云的工具来获取对应的数据。

https://datav.aliyun.com/portal/school/atlas/area_selector

### 整体代码

接下来就是具体的代码实现：

```html
<template>
    <div id="container" ref="container"></div>

    <div id="tooltip" ref="tooltip"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three';
import * as d3 from 'd3';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = ref();
const tooltip = ref();

let scene = new THREE.Scene();
const camera: any = ref();
const sceneLight: any = ref();
const renderer: any = ref();
const raycaster: any = ref();
const controls: any = ref();
const mouse: any = ref();
const hoverObj: any = ref();
// const circleGeometry: any = ref();

//初始化摄像机
const initCamera = () => {
    camera.value = new THREE.PerspectiveCamera(75, container.value.offsetWidth / container.value.offsetHeight, 0.1, 1000);
    camera.value.position.set(10, -90, 77);
    camera.value.lookAt(scene.position);
}
//初始化renderer
const initRenderer = () => {
    renderer.value = new THREE.WebGLRenderer();
    renderer.value.setSize(container.value.offsetWidth, container.value.offsetHeight)
}
//初始化灯光
const initLight = () => {
    sceneLight.value = new THREE.AmbientLight(0xffffff, 20);
}
//加载json数据
const loadJson = () => {
    const loader = new THREE.FileLoader();
    loader.load('src/assets/中华人民共和国.json', (data: any) => {
        const jsondata = JSON.parse(data);
        generateGeometry(jsondata)
    })
}

// 根据JSON数据生成地图几何体
const generateGeometry = (jsondata: any) => {
    let map = new THREE.Object3D();
    // 使用d3的地图投影
    const projection = d3.geoMercator().center([104.0, 37.5]).translate([0, 0]);
    // 遍历每个省份，创建几何体
    jsondata.features.forEach((element: any) => {
        let province = new THREE.Object3D();
        const coordinates = element.geometry.coordinates;
        if (Array.isArray(coordinates[0][0][0])) {
            coordinates.forEach((multiPolygon: any) => {
                multiPolygon.forEach((polygon: any) => {
                    const shape = new THREE.Shape();
                    const points: any = ref([]);
                    polygon.forEach((coord: any, i: number) => {
                        const [x, y] = projection(coord);
                        if (i === 0) shape.moveTo(x, -y);
                        else shape.lineTo(x, -y);
                        points.value.push(new THREE.Vector3(x, -y, 5));
                    })
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points.value);
                    const lineMaterial = new THREE.LineBasicMaterial({ color: 'white' });
                    const line = new THREE.Line(lineGeometry, lineMaterial);

                    const extrudeSettings = { depth: 10, bevelEnabled: false };
                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    const material = new THREE.MeshBasicMaterial({ color: '##999', transparent: true, opacity: 0.6 });
                    const material1 = new THREE.MeshBasicMaterial({
                        color: '#888',
                        transparent: true,
                        opacity: 0.5,
                    })
                    const mesh = new THREE.Mesh(geometry, [material, material1]);
                    province.properties = element.properties;
                    province.add(mesh);
                    province.add(line);
                })
            })
        } else if (Array.isArray(coordinates[0][0])) {
            coordinates.forEach((polygon: any) => {
                const shape = new THREE.Shape();
                const points: any = ref([]);
                polygon.forEach((coord: any, i: number) => {
                    const [x, y] = projection(coord);
                    if (i === 0) shape.moveTo(x, -y);
                    else shape.lineTo(x, -y);
                    points.value.push(new THREE.Vector3(x, -y, 5));
                })
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points.value);
                const lineMaterial = new THREE.LineBasicMaterial({ color: 'white' });
                const line = new THREE.Line(lineGeometry, lineMaterial);

                const extrudeSettings = { depth: 10, bevelEnabled: false };
                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                const material = new THREE.MeshBasicMaterial({ color: '#999', transparent: true, opacity: 0.6 });
                const material1 = new THREE.MeshBasicMaterial({
                    color: '#888',
                    transparent: true,
                    opacity: 0.5,
                })
                const mesh = new THREE.Mesh(geometry, [material, material1]);
                province.properties = element.properties;
                province.add(mesh);
                province.add(line);
            })
        }
        map.add(province);
    })
    scene.add(map);
}

// 设置光线投射器和鼠标位置，用于检测鼠标悬停对象
const setRaycaster = () => {
    raycaster.value = new THREE.Raycaster();
    mouse.value = new THREE.Vector2();
    const onMouseMove = (event: any) => {
        mouse.value.x = (event.clientX / container.value.offsetWidth) * 2 - 1
        mouse.value.y = -(event.clientY / container.value.offsetHeight) * 2 + 1
        tooltip.value.style.left = event.clientX + 2 + 'px'
        tooltip.value.style.top = event.clientY + 2 + 'px'
    }

    window.addEventListener('mousemove', onMouseMove, false)
}

// 显示或隐藏工具提示
const showTip = () => {
    if (hoverObj.value) {
        const properties = hoverObj.value.object.parent.properties;
        tooltip.value.textContent = properties.name;
        tooltip.value.style.visibility = 'visible';
        // console.log(tooltip.value.textContent);
    } else {
        tooltip.value.style.visibility = 'hidden';
    }
}

// 动画循环，用于渲染场景和更新状态
const animate = () => {
    requestAnimationFrame(animate);
    raycaster.value.setFromCamera(mouse.value, camera.value);
    const intersects = raycaster.value.intersectObjects(scene.children, true);
    // console.log('camera.value', camera.value)
    if (hoverObj.value) {
        hoverObj.value.object.material[0].color.set('#999')
        hoverObj.value.object.material[1].color.set('#888')
    }
    hoverObj.value = null
    hoverObj.value = intersects.find(
        (item: any) => item.object.material && item.object.material.length === 2
    )
    if (hoverObj.value) {
        hoverObj.value.object.material[0].color.set(0xff0000)
        hoverObj.value.object.material[1].color.set(0xff0000)
    }
    showTip();
    renderer.value.render(scene, camera.value);
}

//窗口大小改变时，更新摄像机的宽高比和渲染器的大小
const handleResize = () => {
    if (camera.value && renderer.value && container.value) {
        camera.value.aspect = container.value.offsetWidth / container.value.offsetHeight;
        camera.value.updateProjectionMatrix();
        renderer.value.setSize(container.value.offsetWidth, container.value.offsetHeight);
    }
}

// const circleBottom = () => {

//     circleGeometry.value = new THREE.CircleGeometry(1, 32);
//     const meshLinerMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
//     const circle = new THREE.Line(circleGeometry.value, meshLinerMaterial);
//     scene.add(circle);
// }

// 组件挂载时的初始化逻辑
onMounted(() => {
    scene = new THREE.Scene();
    setRaycaster();
    initLight();
    scene.add(sceneLight.value);
    initCamera();
    loadJson();
    // circleBottom();
    initRenderer();
    container.value.appendChild(renderer.value.domElement);
    controls.value = new OrbitControls(camera.value, container.value);
    controls.value.enableDamping = true
    animate();
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})



</script>

<style lang="scss" scoped>
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}

#container {
    /* border: 1px solid black; */
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
}

#tooltip {
    position: absolute;
    z-index: 2;
    background: white;
    padding: 10px;
    border-radius: 5px;
    visibility: hidden;
    color: #000;
    font-size: 12px;
    font-weight: 600;
}
</style>
```