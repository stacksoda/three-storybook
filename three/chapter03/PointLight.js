/**
 * @file 点光源 可投影
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addHouseAndTree } from "../util/util";
import './style.scss';

class PointLight extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    componentWillUnmount(){
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const renderer = initRenderer(targetNode);// 绑定dom并返回renderer
        const camera = initCamera();
        const scene = new THREE.Scene();
        // 全局光
        const ambientLight = new THREE.AmbientLight("#0c0c0c");
        scene.add(ambientLight);
        // 点光源
        const pointColor = "#ccffcc";
        const pointLight = new THREE.PointLight(pointColor);
        pointLight.decay = 0.1;
        
        pointLight.castShadow = true;

        scene.add(pointLight);

        const helper = new THREE.PointLightHelper(pointLight);
        scene.add(helper);

        const shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);
        scene.add(shadowHelper);

        const sphereLight = new THREE.SphereGeometry(0.2);
        const sphereLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xac6c25
        });
        const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.position.copy(new THREE.Vector3(3, 0, 5));
        scene.add(sphereLightMesh);

        // 添加对象
        addHouseAndTree(scene);
        // 控制设定
        // gui
        this.gui = new dat.GUI();
        const controls = setupControls(this.gui);
        // 镜头控制
        const trackballControls = initTrackballControls(camera, renderer);
        const clock = new THREE.Clock();
        // 帧率刷新
        const stats = initStatus();
        // 监听屏幕变化
        window.addEventListener('resize', onResize, false);
        threeRender();
        let invert = 1;
        let phase = 0;
        function threeRender() {
            stats.update();
            helper.update();
            shadowHelper.update();

            pointLight.position.copy(sphereLightMesh.position);
            
            if (phase > 2 * Math.PI) {
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase += controls.rotationSpeed;
            }
            sphereLightMesh.position.z = +(25 * (Math.sin(phase)));
            sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
            sphereLightMesh.position.y = 5;

            if (invert < 0) {
                const pivot = 14;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }
            trackballControls.update(clock.getDelta());
            requestAnimationFrame(threeRender);
            renderer.render(scene, camera);
        }
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        function setupControls(gui) {
            const controls = new function() {
                this.rotationSpeed = 0.01;
                this.bouncingSpeed = 0.03;
                this.ambientColor = ambientLight.color.getStyle();
                this.pointColor = pointLight.color.getStyle();
                this.intensity = 1;
                this.distance = pointLight.distance;
            };
            gui.addColor(controls, 'ambientColor').onChange(function (e) {
                ambientLight.color = new THREE.Color(e);
              });
          
              gui.addColor(controls, 'pointColor').onChange(function (e) {
                pointLight.color = new THREE.Color(e);
              });
          
              gui.add(controls, 'distance', 0, 100).onChange(function (e) {
                pointLight.distance = e;
              });
          
              gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
                pointLight.intensity = e;
              });
            return controls;
        }
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}

export default PointLight;