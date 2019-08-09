import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';

import { initStatus, initTrackballControls } from "../util/util";

class BaseScene extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    init = targetNode => {
        window.addEventListener('resize', onResize, false);
        const stats = initStatus();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set(-30, 40, 30);
        camera.lookAt(scene.position);
        
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        const axes = new THREE.AxesHelper(20);
        scene.add(axes);

        const planeGeometry = new THREE.PlaneGeometry(60, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xAAAAAA
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 0);
        scene.add(plane);

        const spotLight = new THREE.SpotLight(0xFFFFFF, 1.2, 150, 120);
        spotLight.position.set(-40, 40, -15);
        spotLight.castShadow = true;
        scene.add(spotLight);

        const ambienLight = new THREE.AmbientLight(0x3c3c3c);
        scene.add(ambienLight);

        targetNode.appendChild(renderer.domElement);

        const trackballControls = initTrackballControls(camera, renderer);
        const clock = new THREE.Clock();

        const controls = new function(){
            this.rotationSpeed = 0.02;
            this.numberOfObjects = scene.children.length;

            this.removeCube = function() {
                const allChildren = scene.children;
                const lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            };

            this.addCube = function() {
                const cubeSize = Math.ceil((Math.random() * 3));
                const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                const cubeMaterial = new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff
                });
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;
                cube.name = "cube-" + scene.children.length;

                cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
                cube.position.y = Math.round((Math.random() * 5));
                cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

                scene.add(cube);
                this.numberOfObjects = scene.children.length
            }

            this.outputObjects = function() {
                console.log(scene.children);
            }
        }
        const gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'addCube');
        gui.add(controls, 'removeCube');
        gui.add(controls, 'outputObjects');
        gui.add(controls, 'numberOfObjects').listen();


        threeRender();
        let step = 0;
        function threeRender(){
            trackballControls.update(clock.getDelta());
            stats.update();

            scene.traverse(function (e){
                if (e instanceof THREE.Mesh && e != plane) {
                    e.rotation.x += controls.rotationSpeed;
                    e.rotation.y += controls.rotationSpeed;
                    e.rotation.z += controls.rotationSpeed;
                }
            })
            requestAnimationFrame(threeRender);
            renderer.render(scene, camera);
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}
export default BaseScene;
