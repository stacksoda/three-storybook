/**
 * @file Lambert网格材质 
 * 一种非光泽表面的材质，没有镜面高光
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addBasicMaterialSettings, loadGopher } from "../util/util";
import './style.scss';

class MeshLambertMaterial extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    componentWillUnmount(){
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const scene = new THREE.Scene();
        const renderer = initRenderer(targetNode);// 绑定dom并返回renderer
        const camera = initCamera();
        // canvasRenderer已经被移除 因此不再进行renderer切换

        // 全局光
        const ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);
        // 聚光灯
        const spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.shadow.mapSize.set(2048, 2048);
        spotLight.position.set(-30, 60, 60);
        spotLight.castShadow = true;
        scene.add(spotLight);
        // 添加对象
        // addHouseAndTree(scene);
        const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0x555555
        });
        const groundMesh = new THREE.Mesh(groundGeom, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = -20;
        scene.add(groundMesh);

        const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
        const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
        const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

        const meshMaterial = new THREE.MeshLambertMaterial({
            color: 0x7777ff,
        });

        const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
        const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
        const plane = new THREE.Mesh(planeGeometry, meshMaterial);

        sphere.position.set(0, 3, 2);
        cube.position.copy(sphere.position);
        plane.position.copy(sphere.position);

        scene.add(cube);

        camera.position.x = -20;
        camera.position.y = 30;
        camera.position.z = 40;
        camera.lookAt(new THREE.Vector3(10, 0, 0));


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
        let selectedMesh = cube;
        threeRender();
        let step = 0;
        function threeRender() {
            stats.update();
            selectedMesh.rotation.y = step += 0.01;

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
                this.rotationSpeed = 0.02;
                this.bouncingSpeed = 0.03;

                this.opacity = meshMaterial.opacity;
                this.transparent = meshMaterial.transparent;
                this.overdraw = meshMaterial.overdraw;
                this.visible = meshMaterial.visible;
                this.emissive = meshMaterial.emissive.getHex();
                
                this.side = "front";
                this.color = meshMaterial.color.getStyle();
                this.wrapAround = false;
                this.wrapR = 1;
                this.wrapG = 1;
                this.wrapB = 1;

                this.selectedMesh = "cube";
            }
            addBasicMaterialSettings(gui, controls, meshMaterial);

            const spGui = gui.addFolder("THREE.MeshLamberMaterial");
            spGui.addColor(controls, 'color').onChange(e => {
                meshMaterial.color.setStyle(e);
            });
            spGui.addColor(controls, 'emissive').onChange( e => {
                meshMaterial.emissive = new THREE.Color(e)
            });

            spGui.add(meshMaterial, 'wireframe');
            spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);
            
            loadGopher(meshMaterial).then(gopher => {
                gopher.scale.x = 4;
                gopher.scale.y = 4;
                gopher.scale.z = 4;
                gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher"]).onChange( e => {
                    scene.remove(plane);
                    scene.remove(cube);
                    scene.remove(sphere);
                    scene.remove(gopher);

                    switch (e) {
                        case "cube":
                            scene.add(cube);
                            selectedMesh = cube;
                            break;
                        case "sphere":
                            scene.add(sphere);
                            selectedMesh = sphere;
                            break;
                        case "plane":
                            scene.add(plane);
                            selectedMesh = plane;
                            break;
                        case "gopher":
                            scene.add(gopher);
                            selectedMesh = gopher;
                            break;
                    }
                })
            })

            return controls;
        }
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}

export default MeshLambertMaterial;
