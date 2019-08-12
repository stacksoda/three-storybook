/**
 * 控制网格的属性
 */
import React from 'react';
import * as THREE from 'three';
import { initTrackballControls } from "../util/util";

class ControlProperties extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    init = targetNode => {
        window.addEventListener('resize', onResize, false);
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);

        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(scene.position);

        const ambientLight = new THREE.AmbientLight(0x3c3c3c);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.position.set(-40, 30, 30);
        spotLight.castShadow = true;
        scene.add(spotLight);

        const geomMaterial = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
        const geomGeometry = new THREE.BoxGeometry(5, 8, 3);
        const cube = new THREE.Mesh(geomGeometry, geomMaterial);
        scene.add(cube);
        // ControlProperties
        cube.position.x = 1;
        cube.position.y = 10;
        // cube.position.z = 1;

        // cube.rotation.x = 1;
        // cube.rotation.y = 1;
        cube.rotation.z = Math.PI / 4;

        cube.scale.set(2, 2, 2);

        targetNode.appendChild(renderer.domElement);
        const trackballControls = initTrackballControls(camera, renderer);
        const clock = new THREE.Clock();
        threeRender();
        let step = 0;
        function threeRender() {
            step++;
            cube.translateX(-1 / 60);
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

export default ControlProperties;
