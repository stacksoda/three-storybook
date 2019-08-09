import React from 'react';
import * as THREE from 'three';
import TrackballControls from 'three/examples/jsm/controls/TrackballControls';

class AddLight extends React.Component {
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
        renderer.shadowMap.enabled = true;

        const axes = new THREE.AxesHelper(20);
        scene.add(axes);

        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xFF0000,
            wireframe: false// 线框
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        // cube.position.set(-4, 3, 0);
        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;
        cube.castShadow = true; //指定方块投射阴影

        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0x7777FF,
            wireframe: true
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 4, 2);
        sphere.castShadow = true;// 投射阴影

        const planeGeometry = new THREE.PlaneGeometry(60, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xAAAAAA
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);
        plane.receiveShadow = true;// 指定接收阴影

        scene.add(plane)
        scene.add(cube);
        scene.add(sphere);

        const spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.position.set(-40, 40, -15);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        spotLight.shadow.camera.far = 130;
        spotLight.shadow.camera.near = 40;

        scene.add(spotLight);
        const ambienLight = new THREE.AmbientLight(0x353535);
        scene.add(ambienLight);

        targetNode.appendChild(renderer.domElement);

        renderer.render(scene, camera);
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}
export default AddLight;