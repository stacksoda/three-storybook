/**
 * @file 平行光 可用于投影
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addHouseAndTree } from "../util/util";
import './style.scss';

class DirectionalLight extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    componentWillUnmount() {
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const renderer = initRenderer(this.threeNode);// 绑定dom并返回renderer
        const scene = new THREE.Scene();
        const camera = initCamera();
        camera.position.set(-80, 80, 80);

        const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = -5;
        plane.position.z = 0;

        scene.add(plane);

        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xff3333
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        scene.add(cube);

        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0x7777ff
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = 20;
        sphere.position.y = 0;
        sphere.position.z = 2;
        sphere.castShadow = true;

        scene.add(sphere);

        const ambiColor = "#1c1c1c";
        const ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);

        const target = new THREE.Object3D();
        target.position.copy(new THREE.Vector3(5, 0, 0));

        const pointColor = "#ff5808";
        const directionalLight = new THREE.DirectionalLight(pointColor);
        directionalLight.position.set(-40, 60, -10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 2;
        directionalLight.shadow.camera.far = 80;
        directionalLight.shadow.camera.left = -30;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 30;
        directionalLight.shadow.camera.bottom - 30;

        directionalLight.intensity = 0.5;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;

        scene.add(directionalLight);

        const shadowCamera = new THREE.CameraHelper(directionalLight.shadow.camera);

        const sphereLight = new THREE.SphereGeometry(0.2);
        const sphereLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xac6c25
        });
        const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.castShadow = true;

        sphereLightMesh.position.copy(new THREE.Vector3(3, 20, 3));
        scene.add(sphereLightMesh);

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
        let step = 0;
        function threeRender() {
            stats.update();
            trackballControls.update(clock.getDelta());

            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            step += controls.bouncingSpeed;
            sphere.position.x = 20 + (10 * (Math.cos(step)));
            sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

            sphereLightMesh.position.z = -8;
            sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
            sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

            directionalLight.position.copy(sphereLightMesh.position);

            requestAnimationFrame(threeRender);
            renderer.render(scene, camera);
        }
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        function setUpControls(gui) {
            const controls = new function () {
                this.rotationSpeed = 0.03;
                this.bouncingSpeed = 0.03;
                this.ambientColor = ambiColor;
                this.pointColor = pointColor;
                this.intensity = 0.5;
                this.debug = false;
                this.castShadow = true;
                this.onlyShadow = false;
                this.target = "Plance";
            }
            gui.addColor(controls, 'ambientColor').onChange(e => {
                ambientLight.color = new THREE.Color(e);
            });

            gui.addColor(controls, 'pointColor').onChange(e => {
                directionalLight.color.copy(new THREE.Color(e));
            });

            gui.add(controls, 'intensity', 0, 5).onChange(e => {
                directionalLight.intensity = e;
            });

            gui.add(controls, 'debug').onChange(e => {
                e ? scene.add(shadowCamera) : scene.remove(shadowCamera);
            });

            gui.add(controls, 'castShadow').onChange(e => {
                directionalLight.castShadow = e;
            });

            gui.add(controls, 'onlyShadow').onChange(e => {
                directionalLight.onlyShadow = e;
            });

            gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(e => {
                switch (e) {
                    case "Plane":
                        directionalLight.target = plane;
                        break;
                    case "Sphere":
                        directionalLight.target = sphere;
                        break;
                    case "Cube":
                        directionalLight.target = cube;
                        break;
                }
            })
            return controls;
        }
    }
    render() {
        return <div ref={node => { this.threeNode = node }}></div>
    }
}

export default DirectionalLight;