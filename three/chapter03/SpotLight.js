/**
 * @file 聚光灯 用于投射阴影
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addDefaultCubeAndSphere, addGroundPlane } from "../util/util";
import './style.scss';

class SpotLight extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    componentWillUnmount() {
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const renderer = initRenderer(targetNode);// 绑定dom并返回renderer
        const camera = initCamera();
        const scene = new THREE.Scene();

        // 添加对象
        const cubeAndSphere = addDefaultCubeAndSphere(scene);
        const cube = cubeAndSphere.cube;
        const sphere = cubeAndSphere.sphere;
        const plane = addGroundPlane(scene);
        // 全局光
        const ambiColor = "#1c1c1c";
        const ambientLight = new THREE.AmbientLight(ambiColor);
        // const ambientLight = new THREE.AmbientLight("#606008", 1);
        scene.add(ambientLight);
        // 聚光灯
        const spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 30, -10);
        spotLight0.lookAt(plane);
        scene.add(spotLight0);

        const target = new THREE.Object3D();
        target.position.copy(new THREE.Vector3(5, 0, 0));

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 100;
        spotLight.target = plane;
        spotLight.distance = 0;
        spotLight.angle = 0.4;
        spotLight.shadow.camera.fov = 120
        scene.add(spotLight);

        const debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);

        const pp = new THREE.SpotLightHelper(spotLight);
        scene.add(pp);

        const sphereLight = new THREE.SphereGeometry(0.2);
        const sphereLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xac6c25
        });
        const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.castShadow = true;

        sphereLightMesh.position.copy(new THREE.Vector3(3, 20, 3));
        scene.add(sphereLightMesh);

        let step = 0;
        let invert = 1;
        let phase = 0;

        // 控制设定
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
            trackballControls.update(clock.getDelta());

            cube.rotation.x += controls.rotationSpeed;
            cube.rotation.y += controls.rotationSpeed;
            cube.rotation.z += controls.rotationSpeed;

            step += controls.bouncingSpeed;
            sphere.position.x = 20 + (10 * (Math.cos(step)));
            sphere.position.y = 2 + (10 * Math.abs(Math.sign(step)));

            if (!controls.stopMovingLight) {
                if (phase > 2 * Math.PI) {
                    invert = invert * -1;
                    phase -= 2 * Math.PI;
                } else {
                    phase += controls.rotationSpeed;
                }
                sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
                sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
                sphereLightMesh.position.y = 15;

                if (invert < 0) {
                    let pivot = 14;
                    sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
                }
                spotLight.position.copy(sphereLightMesh.position);
            }
            pp.update();
            requestAnimationFrame(threeRender);
            renderer.render(scene, camera);
        }
        function onResize(gui) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        function setupControls(gui) {
            const controls = new function () {
                this.rotationSpeed = 0.03;
                this.bouncingSpeed = 0.03;
                this.ambientColor = ambiColor;
                this.pointColor = spotLight.color.getStyle();
                this.intensity = 1;
                this.distance = 0;
                this.angle = 0.1;
                this.shadowDebug = false;
                this.castShadow = true;
                this.target = "Plane";
                this.stopMovingLight = false;
                this.penumbra = 0
            }
            
            gui.addColor(controls, 'ambientColor').onChange(function (e) {
                ambientLight.color = new THREE.Color(e);
            });

            gui.addColor(controls, 'pointColor').onChange(function (e) {
                spotLight.color = new THREE.Color(e);
            });

            gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
                spotLight.angle = e;
            });

            gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
                spotLight.intensity = e;
            });

            gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
                spotLight.penumbra = e;
            });

            gui.add(controls, 'distance', 0, 200).onChange(function (e) {
                spotLight.distance = e;
            });

            gui.add(controls, 'shadowDebug').onChange(function (e) {
                if (e) {
                    scene.add(debugCamera);
                } else {
                    scene.remove(debugCamera);
                }
            });

            gui.add(controls, 'castShadow').onChange(function (e) {
                spotLight.castShadow = e;
            });

            gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
                switch (e) {
                    case "Plane":
                        spotLight.target = plane;
                        break;
                    case "Sphere":
                        spotLight.target = sphere;
                        break;
                    case "Cube":
                        spotLight.target = cube;
                        break;
                }

            });

            gui.add(controls, 'stopMovingLight').onChange(function (e) {
                stopMovingLight = e;
            });
            return controls;
        }
    }
    render() {
        return <div ref={node => { this.threeNode = node }}></div>
    }
}

export default SpotLight;