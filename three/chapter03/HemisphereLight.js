/**
 * @file 全局照亮对象的光 不可用于阴影
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addHouseAndTree } from "../util/util";
import './style.scss';
import bg from '../../assets/textures/ground/grasslight-big.jpg'

class HemisphereLight extends React.Component {
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
        const textureGrass = new THREE.TextureLoader().load(bg);
        textureGrass.wrapS = THREE.RepeatWrapping;
        textureGrass.wrapT = THREE.RepeatWrapping;
        textureGrass.repeat.set(10, 10);

        const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({
            map: textureGrass
        });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
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

        const sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x7777ff
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = 10;
        sphere.position.y = 5;
        sphere.position.z = 10;
        sphere.castShadow = true;

        scene.add(sphere);

        const spotLight0 = new THREE.SpotLight(0xcccccc);
        spotLight0.position.set(-40, 60, -10);
        spotLight0.lookAt(plane);
        scene.add(spotLight0);

        const target = new THREE.Object3D();
        target.position.copy(new THREE.Vector3(5, 0, 0));

        const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
        hemiLight.position.set(0, 500, 0);
        scene.add(hemiLight);

        const pointColor = "#ffffff";
        const dirLight = new THREE.DirectionalLight(pointColor);
        dirLight.position.set(30, 10, -50);
        dirLight.castShadow = true;
        dirLight.target = plane;
        dirLight.shadow.camera.near = 0.1
        dirLight.shadow.camera.far = 200;
        dirLight.shadow.camera.left = -50;
        dirLight.shadow.camera.right = 50;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        

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
    render() {
        return <div ref={node => { this.threeNode = node }}></div>
    }
}

export default HemisphereLight;
