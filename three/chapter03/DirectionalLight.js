/**
 * @file 平行光 可用于投影
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addHouseAndTree } from "../util/util";
import './style.scss';

class AmbientLight extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    componentWillUnmount(){
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const renderer = initRenderer(this.threeNode);// 绑定dom并返回renderer
        const camera = initCamera();
        const scene = new THREE.Scene();
        // 全局光
        const ambientLight = new THREE.AmbientLight("#606008", 1);
        scene.add(ambientLight);
        // 聚光灯
        const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
        spotLight.shadow.mapSize.set(2048, 2048);
        spotLight.position.set(-30, 40, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);
        // 添加对象
        addHouseAndTree(scene);
        // 控制设定
        // gui
        this.gui = new dat.GUI();
        // 镜头控制
        const trackballControls = initTrackballControls(camera, renderer);
        const clock = new THREE.Clock();
        // 帧率刷新
        const stats = initStatus();
        // 监听屏幕变化
        window.addEventListener('resize', onResize, false);
        threeRender();
        function threeRender() {
            stats.update();
            trackballControls.update(clock.getDelta());
            requestAnimationFrame(threeRender);
            renderer.render(scene, camera);
        }
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}

export default AmbientLight;