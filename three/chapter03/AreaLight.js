/**
 * @file 区域光
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addHouseAndTree } from "../util/util";
import './style.scss';

class AreaLight extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    componentWillUnmount(){
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const renderer = initRenderer(targetNode, { antialias: true });// 绑定dom并返回renderer
        const camera = initCamera();
        const scene = new THREE.Scene();

        camera.position.set(-50, 30, 50);
        
        // 添加对象
        // addHouseAndTree(scene);
        const planeGeometry = new THREE.PlaneGeometry(70, 70, 1, 1);
        const planeMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.044676705160855,
            metalness: 0.0
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);

        const spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 60, -10);
        spotLight0.intensity = 0.1;
        spotLight0.lookAt(plane);
        scene.add(spotLight0);

        const areaLight1 = new THREE.RectAreaLight(0xff0000, 500, 4, 10);
        areaLight1.position.set(-10, 10, -35);
        areaLight1.lookAt(0, 0, 0);
        scene.add(areaLight1);

        const areaLight2 = new THREE.RectAreaLight(0x00ff00, 500, 4, 10);
        areaLight2.position.set(0, 10, -35);
        areaLight2.lookAt(0, 0, 0);
        scene.add(areaLight2);

        const areaLight3 = new THREE.RectAreaLight(0x0000ff, 500, 4, 10);
        areaLight3.position.set(10, 10, -35);
        areaLight3.lookAt(0, 0, 0);
        scene.add(areaLight3);

        const planeGeometrySide = new THREE.BoxGeometry(4, 10, 0);

        const planeGeometry1Mat = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        const plane1 = new THREE.Mesh(planeGeometrySide, planeGeometry1Mat);
        plane1.position.copy(areaLight1.position);
        scene.add(plane1);

        const planeGeometry2Mat = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        const plane2 = new THREE.Mesh(planeGeometrySide, planeGeometry2Mat);
        plane2.position.copy(areaLight2.position);
        scene.add(plane2);

        const planeGeometry3Mat = new THREE.MeshBasicMaterial({
            color: 0x0000ff
        });
        const plane3 = new THREE.Mesh(planeGeometrySide, planeGeometry3Mat);
        plane3.position.copy(areaLight3.position);
        scene.add(plane3);
        // 官方 demo
        // const width = 10;
        // const height = 10;
        // const intensity = 1;
        // const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
        // rectLight.position.set(5, 5, 0);
        // rectLight.lookAt(0, 0, 0);
        // scene.add(rectLight);

        // const rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
        // scene.add(rectLightHelper);


       
        // 控制设定
        // gui
        this.gui = new dat.GUI();
        const controls = setUpControls(this.gui);
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
        function setUpControls(gui){
            const controls = new function(){}

            return controls;
        }
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}

export default AreaLight;
