/**
 * @file 两种摄像机的不同效果
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initTrackballControls } from "../util/util";
import './style.scss';

class BothCamera extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    componentWillUnmount() {
        this.gui.destroy();
    }
    init = targetNode => {
        window.addEventListener('resize', onResize, false);
        const scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        camera.lookAt(scene.position);
        
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        // const axes = new THREE.AxesHelper(20);
        // scene.add(axes);

        const planeGeometry = new THREE.PlaneGeometry(180, 180);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);

        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        for (let j = 0; j < (planeGeometry.parameters.height / 5); j++) {
            for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
                const rnd = Math.random() * 0.75 + 0.25;
                const cubeMaterial = new THREE.MeshLambertMaterial();
                cubeMaterial.color = new THREE.Color(rnd, 0, 0);
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5);
                cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + (i * 5);
                cube.position.y = 2;
                scene.add(cube);
            }
        }

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-10, 40, 60);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x3c3c3c);
        scene.add(ambientLight);

        targetNode.appendChild(renderer.domElement);
        let trackballControls = initTrackballControls(camera, renderer);
        const controls = new function() {
            this.perspective = "Perspective";
            this.switchCamera = function() {
                if (camera instanceof THREE.PerspectiveCamera) {
                    camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, -200, 500);
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;
                    camera.lookAt(scene.position);

                    trackballControls = initTrackballControls(camera, renderer);
                    this.perspective = "Orthographic";
                } else {
                    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                    camera.position.x = 120;
                    camera.position.y = 60;
                    camera.position.z = 180;

                    camera.lookAt(scene.position);
                    trackballControls = initTrackballControls(camera, renderer);
                    this.perspective = "Perspective";
                }
            }
        }

        this.gui = new dat.GUI();
        this.gui.add(controls, 'switchCamera');
        this.gui.add(controls, 'perspective').listen();
        const clock = new THREE.Clock();
        threeRender();
        function threeRender() {
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

export default BothCamera;