/**
 * @file 标准网格材质
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addBasicMaterialSettings, loadGopher, addLargeGroundPlane, addMeshSelection } from "../util/util";
import './style.scss';

class MeshPhysicalMaterial extends React.Component {
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
        addLargeGroundPlane(scene);
        // 聚光灯
        const spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.shadow.mapSize.set(2048, 2048);
        spotLight.position.set(-0, 30, 60);
        spotLight.castShadow = true;
        spotLight.intensity = 0.6;
        scene.add(spotLight);

        const material = new THREE.MeshPhysicalMaterial({color: 0x7777ff});

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
        // let selectedMesh = cube;
        // camera.lookAt(selectedMesh.position);
        threeRender();
        let step = 0;
        function threeRender() {
            stats.update();
            // selectedMesh.rotation.y = step += 0.01;
            if (controls.selected) controls.selected.rotation.y = step += 0.01;
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
                this.color = material.color.getStyle();
                this.emissive = material.emissive.getStyle();
                // this.specular = material.specular.getStyle();
            }
            addBasicMaterialSettings(gui, controls, material);
            addMeshSelection(gui, controls, material, scene);
            const spGui = gui.addFolder("THREE.MeshPhysicalMaterial");
            spGui.addColor(controls, 'color').onChange(e => {
                material.color.setStyle(e);
            });
            spGui.addColor(controls, 'emissive').onChange( e => {
                material.emissive = new THREE.Color(e);
            });
            spGui.add(material, 'metalness', 0, 1, 0.01);
            spGui.add(material, 'roughness', 0, 1, 0.01);
            spGui.add(material, 'clearCoat', 0, 1, 0.01);
            spGui.add(material, 'clearCoatRoughness', 0, 1, 0.01);
            spGui.add(material, 'reflectivity', 0, 1, 0.01);
            // spGui.add(material, 'shininess', 0, 100);
            spGui.add(material, 'wireframe');
            spGui.add(material, 'wireframeLinewidth', 0, 20);
            
            camera.lookAt(new THREE.Vector3(0, 0, 0))

            return controls;
        }
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}

export default MeshPhysicalMaterial;
