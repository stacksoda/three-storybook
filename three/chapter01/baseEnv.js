import React from 'react';
import * as THREE from 'three';
import TrackballControls from 'three/examples/jsm/controls/TrackballControls';
import './style.scss';

class BaseEnv extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    init = targetNode => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set(-30, 40, 30);
        camera.lookAt(scene.position);
        
        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const axes = new THREE.AxesHelper(20);
        scene.add(axes);

        const planeGeometry = new THREE.PlaneGeometry(60, 20);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xAAAAAA
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);
        scene.add(plane)

        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            wireframe: true
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 0);
        scene.add(cube);

        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x7777FF,
            wireframe: true
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 4, 2);
        scene.add(sphere);

        targetNode.appendChild(renderer.domElement);

        renderer.render(scene, camera);
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}
export default BaseEnv;
