/**
 * @file Lambert网格材质 
 * 一种非光泽表面的材质，没有镜面高光
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addBasicMaterialSettings, loadGopher, addLargeGroundPlane, addMeshSelection } from "../util/util";
import './style.scss';

class MeshPhongMaterial extends React.Component {
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
        // canvasRenderer已经被移除 因此不再进行renderer切换
        addLargeGroundPlane(scene);
        // 全局光
        // const ambientLight = new THREE.AmbientLight(0x0c0c0c);
        // scene.add(ambientLight);
        // 聚光灯
        const spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.shadow.mapSize.set(2048, 2048);
        spotLight.position.set(-0, 30, 60);
        spotLight.castShadow = true;
        spotLight.intensity = 0.6;
        scene.add(spotLight);

        const material = new THREE.MeshPhongMaterial({color: 0x7777ff});
        
        // 添加对象
        // addHouseAndTree(scene);
        // const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
        // const groundMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x555555
        // });
        // const groundMesh = new THREE.Mesh(groundGeom, groundMaterial);
        // groundMesh.rotation.x = -Math.PI / 2;
        // groundMesh.position.y = -20;
        // scene.add(groundMesh);

        // const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
        // const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
        // const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

        // const meshMaterial = new THREE.MeshLambertMaterial({
        //     color: 0x7777ff,
        // });

        // const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
        // const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
        // const plane = new THREE.Mesh(planeGeometry, meshMaterial);

        // sphere.position.set(0, 3, 2);
        // cube.position.copy(sphere.position);
        // plane.position.copy(sphere.position);

        // scene.add(cube);

        // camera.position.x = -20;
        // camera.position.y = 30;
        // camera.position.z = 40;
        // camera.lookAt(new THREE.Vector3(10, 0, 0));


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
                this.specular = material.specular.getStyle();
            }
            addBasicMaterialSettings(gui, controls, material);
            addMeshSelection(gui, controls, material, scene);
            const spGui = gui.addFolder("THREE.MeshPhongMaterial");
            spGui.addColor(controls, 'color').onChange(e => {
                material.color.setStyle(e);
            });
            spGui.addColor(controls, 'emissive').onChange( e => {
                material.emissive = new THREE.Color(e);
            });
            spGui.addColor(controls, 'specular').onChange( e => {
                material.specular = new THREE.Color(e);
            })
            spGui.add(material, 'shininess', 0, 100);
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

export default MeshPhongMaterial;
