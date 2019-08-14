/**
 * @file 复合网格材质
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import {SceneUtils} from 'three/examples/jsm/utils/SceneUtils'
import { initStatus, initRenderer, initCamera, initTrackballControls, addHouseAndTree, addBasicMaterialSettings } from "../util/util";
import './style.scss';

class CombinedMaterial extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    componentWillUnmount() {
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const renderer = initRenderer(targetNode);// 绑定dom并返回renderer
        // const camera = initCamera();
        const scene = new THREE.Scene();
        // scene.overrideMaterial = new THREE.MeshDepthMaterial();

        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 110);
        camera.position.set(-50, 40, 50);
        camera.lookAt(scene.position);
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
        function threeRender() {
            stats.update();

            scene.traverse(function (e) {
                if (e instanceof THREE.Mesh) {

                    e.rotation.x += controls.rotationSpeed;
                    e.rotation.y += controls.rotationSpeed;
                    e.rotation.z += controls.rotationSpeed;
                }
            });

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
            const controls = new function(){
                this.cameraNear = camera.near;
                this.cameraFar = camera.far;
                this.rotationSpeed = 0.02;
                this.numberOfObjects = scene.children.length;
                this.color = 0x00ff00;

                this.addCube = function() {
                    const cubeSize = Math.ceil(3 + (Math.random() * 3));
                    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

                    const cubeMaterial = new THREE.MeshDepthMaterial();
                    const colorMaterial = new THREE.MeshBasicMaterial({
                        color: controls.color,
                        transparent: true,
                        blending: THREE.MultiplyBlending
                    });
                    const cube = new SceneUtils.createMultiMaterialObject(cubeGeometry, [
                        colorMaterial,
                        cubeMaterial
                    ]);
                    cube.children[1].scale.set(0.99, 0.99, 0.99);
                    cube.castShadow = true;
            
                    // position the cube randomly in the scene
                    cube.position.x = -60 + Math.round((Math.random() * 100));
                    cube.position.y = Math.round((Math.random() * 10));
                    cube.position.z = -100 + Math.round((Math.random() * 150));
            
                    // add the cube to the scene
                    scene.add(cube);
                }
                this.removeCube = function() {
                    const allChildren = scene.children;
                    const lastObject = allChildren[allChildren.length - 1];
                    if (lastObject instanceof THREE.Mesh) {
                        scene.remove(lastObject);
                        this.numberOfObjects = scene.children.length;
                    }
                }
                this.outputObjects = function() {
                    console.log('scene.children', scene.children);
                }
            };
            // addBasicMaterialSettings(gui, controls, scene.overrideMaterial);
            // const spGui = gui.addFolder("THREE.MeshDepthMaterial");
            // spGui.add(scene.overrideMaterial, 'wireframe');
            // spGui.add(scene.overrideMaterial, 'wireframeLinewidth', 0, 20);
            gui.addColor(controls, 'color');
            gui.add(controls, 'rotationSpeed', 0, 0.5);
            gui.add(controls, 'addCube');
            gui.add(controls, 'removeCube');
            gui.add(controls, 'cameraNear', 0, 100).onChange(e => {
                camera.near = e;
                camera.updateProjectionMatrix();
            });
            gui.add(controls, 'cameraFar', 50, 200).onChange(e => {
                camera.far = e;
                camera.updateProjectionMatrix();
            });

            for (let index = 0; index < 20; index++) {
                controls.addCube();
            };

            return controls;
        }
    }
    render() {
        return <div ref={node => { this.threeNode = node }}></div>
    }
}

export default CombinedMaterial;
