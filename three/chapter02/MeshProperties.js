/**
 * 控制网格的属性
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initTrackballControls } from "../util/util";
import './style.scss';

class MeshProperties extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    componentWillUnmount() {
        this.gui.destroy();
    }
    init = targetNode => {
        window.addEventListener('resize', onResize, false);
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        const axes = new THREE.AxesHelper(20);
        scene.add(axes);

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

        const controls = new function() {
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;

            this.positionX = 0;
            this.positionY = 4;
            this.positionZ = 0;

            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            this.scale = 1;

            this.translateX = 0;
            this.translateY = 0;
            this.translateZ = 0;

            this.visible = true;

            this.translate = function() {
                cube.translateX(controls.translateX);
                cube.translateY(controls.translateY);
                cube.translateZ(controls.translateZ);

                controls.positionX = cube.position.x;
                controls.positionY = cube.position.y;
                controls.positionZ = cube.position.z;
            }
        }


        const geomMaterial = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
        const geomGeometry = new THREE.BoxGeometry(5, 8, 3);
        const cube = new THREE.Mesh(geomGeometry, geomMaterial);
        scene.add(cube);
        cube.position.y = 4;
        cube.castShadow = true;
        scene.add(cube);

        // cube.rotation.z = Math.PI / 4;

        // cube.scale.set(2, 2, 2);

        this.gui = new dat.GUI();
        const guiScale = this.gui.addFolder('scale');
        const scaleX = guiScale.add(controls, 'scaleX', 0, 5);
        const scaleY = guiScale.add(controls, 'scaleY', 0, 5);
        const scaleZ = guiScale.add(controls, 'scaleZ', 0, 5);
        scaleX.listen();
        scaleX.onChange(value => {
            cube.scale.x = value;
        });
        scaleY.listen();
        scaleY.onChange(value => {
            cube.scale.y = value;
        });
        scaleZ.listen();
        scaleZ.onChange(value => {
            cube.scale.z = value;
        })
        scaleY.listen();
        scaleZ.listen();
        // 网格的位置控制
        const guiPositon = this.gui.addFolder('position');
        const contX = guiPositon.add(controls, 'positionX', -10, 10);
        const contY = guiPositon.add(controls, 'positionY', -4, 20);
        const contZ = guiPositon.add(controls, 'positionZ', -10, 10);

        contX.listen();
        contX.onChange(function (value){
            cube.position.x = value;
        });

        contY.listen();
        contY.onChange(function (value){
            cube.position.y = value;
        });

        contZ.listen();
        contZ.onChange(function (value){
            cube.position.z = value;
        });
        // 网格旋转
        const guiRotation = this.gui.addFolder('rotation');
        const rotX = guiRotation.add(controls, 'rotationX', -4, 4);
        const rotY = guiRotation.add(controls, 'rotationY', -4, 4);
        const rotZ = guiRotation.add(controls, 'rotationZ', -4, 4);
        rotX.listen();
        rotX.onChange(function (value) {
            cube.rotation.x = value;
        })
        rotY.listen();
        rotY.onChange(function (value) {
            cube.rotation.y = value;
        })
        rotZ.listen();
        rotZ.onChange(function (value) {
            cube.rotation.z = value;
        });
        // 网格位移
        const guiTranslate = this.gui.addFolder('translate');
        guiTranslate.add(controls, 'translateX', -10, 10);
        guiTranslate.add(controls, 'translateY', -10, 10);
        guiTranslate.add(controls, 'translateZ', -10, 10);
        guiTranslate.add(controls, 'translate');
        // 网格是否可见
        const visible = this.gui.add(controls, 'visible');
        visible.listen();
        visible.onChange(value => {
            cube.visible = value;
        })

        targetNode.appendChild(renderer.domElement);
        const trackballControls = initTrackballControls(camera, renderer);
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

export default MeshProperties;
