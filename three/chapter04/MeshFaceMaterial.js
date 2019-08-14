import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import './style.scss';
import { initRenderer, initCamera } from '../util/util';

class MeshFaceMaterial extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    componentWillUnmount() {
        if (this.gui) {
            this.gui.destroy();
        }
    }
    init = targetNode => {
        const renderer = initRenderer(targetNode);
        const camera = initCamera();

        const scene = new THREE.Scene();

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        const group = new THREE.Mesh();
        const mats = [];
        mats.push(new THREE.MeshBasicMaterial({
            color: 0x009e60
        }));
        mats.push(new THREE.MeshBasicMaterial({
            color: 0x0051ba
        }));
        mats.push(new THREE.MeshBasicMaterial({
            color: 0xffd500
        }));
        mats.push(new THREE.MeshBasicMaterial({
            color: 0xff5800
        }));
        mats.push(new THREE.MeshBasicMaterial({
            color: 0xC41E3A
        }));
        mats.push(new THREE.MeshBasicMaterial({
            color: 0xffffff
        }));

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    const cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
                    const cube = new THREE.Mesh(cubeGeom, mats);
                    cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);
                    
                    group.add(cube);
                    cubeGeom.faces.forEach((p, i) => {
                        console.log("face " + i + " : " + p.materialIndex );
                    })
                }
            }          
        }

        group.scale.copy(new THREE.Vector3(2, 2, 2));
        scene.add(group);
        const controls = new function() {
            this.rotationSpeed = 0.01;
            this.nuberOfObjects = scene.children.length;
        };
        const gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);

        render();
        let step = 0;
        function render() {
            group.rotation.y = step += controls.rotationSpeed;
            group.rotation.z = step += controls.rotationSpeed;
            group.rotation.x = step += controls.rotationSpeed;

            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    }
    render() {
        return <div ref={node => { this.threeNode = node }}></div>
    }
}

export default MeshFaceMaterial;
