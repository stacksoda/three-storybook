import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initTrackballControls } from "../util/util";
import {SceneUtils} from '../util/SceneUtils';
import './style.scss';

class CustomGeometry extends React.Component {
    componentDidMount() {
        this.init(this.threeNode);
    }
    componentWillUnmount() {
        this.gui.destroy();
    }
    init = targetNode => {
        window.addEventListener('resize', onResize, false);
        const stats = initStatus();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set(-20, 25, 30);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        const axes = new THREE.AxesHelper(20);
        scene.add(axes);

        const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 0);
        scene.add(plane);

        const spotLight = new THREE.SpotLight(0xFFFFFF, 1, 180, Math.PI / 4);
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.position.set(-40, 30, 30);
        spotLight.castShadow = true;
        scene.add(spotLight);

        const ambienLight = new THREE.AmbientLight(0x3c3c3c);
        scene.add(ambienLight);

        targetNode.appendChild(renderer.domElement);

        const trackballControls = initTrackballControls(camera, renderer);
        const clock = new THREE.Clock();
        // 初始化完毕 用户设定内容
        const vertices = [
            new THREE.Vector3(1, 3, 1),
            new THREE.Vector3(1, 3, -1),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 3, -1),
            new THREE.Vector3(-1, 3, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, -1, 1)
        ];
        const faces = [
            new THREE.Face3(0, 2, 1),
            new THREE.Face3(2, 3, 1),
            new THREE.Face3(4, 6, 5),
            new THREE.Face3(6, 7, 5),
            new THREE.Face3(4, 5, 1),
            new THREE.Face3(5, 0, 1),
            new THREE.Face3(7, 6, 2),
            new THREE.Face3(6, 3, 2),
            new THREE.Face3(5, 7, 0),
            new THREE.Face3(7, 2, 0),
            new THREE.Face3(1, 3, 4),
            new THREE.Face3(3, 6, 4),
        ];
        const customGeometry = new THREE.Geometry();
        customGeometry.vertices = vertices;
        customGeometry.faces = faces;
        customGeometry.computeFaceNormals();

        const materials = [
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
            new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
        ];
        const mesh = SceneUtils.createMultiMaterialObject(customGeometry, materials, THREE);
        mesh.castShadow = true;
        mesh.children.forEach(function (e){
            e.castShadow = true;
        });

        scene.add(mesh);

        function addControls(x, y, z) {
            const controls = new function(){
                this.x = x;
                this.y = y;
                this.z = z;
            };
            return controls;
        }
        const controlPoints = [];
        controlPoints.push(addControls(3, 5, 3));
        controlPoints.push(addControls(3, 5, 0));
        controlPoints.push(addControls(3, 0, 3));
        controlPoints.push(addControls(3, 0, 0));
        controlPoints.push(addControls(0, 5, 0));
        controlPoints.push(addControls(0, 5, 3));
        controlPoints.push(addControls(0, 0, 0));
        controlPoints.push(addControls(0, 0, 3));

        this.gui = new dat.GUI();
        this.gui.add(new function() {
            this.clone = function(){
                const clonedGeometry = mesh.children[0].geometry.clone();
                const materials = [
                    new THREE.MeshLambertMaterial({opacity: 0.8, color: 0xff44ff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
                ];

                const mesh2 = SceneUtils.createMultiMaterialObject(clonedGeometry, materials, THREE);
                mesh2.children.forEach(function (e) {
                    e.castShadow = true;
                });

                mesh2.translateX(5);
                mesh2.translateZ(5);
                mesh2.name = "clone";
                scene.remove(scene.getChildByName("clone"));
                scene.add(mesh2)
            }
        }, 'clone')

        for (var i = 0; i < 8; i++) {

            const f1 = this.gui.addFolder('Vertices ' + (i + 1));
            f1.add(controlPoints[i], 'x', -10, 10);
            f1.add(controlPoints[i], 'y', -10, 10);
            f1.add(controlPoints[i], 'z', -10, 10);
      
        }
        // 用户设定内容完毕 渲染
        threeRender();
        let step = 0;
        function threeRender() {
            trackballControls.update(clock.getDelta());
            stats.update();
            const vertices = [];
            for (let i = 0; i < 8; i++) {
                vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
            }

            mesh.children.forEach(function (e) {
                e.geometry.vertices = vertices;
                e.geometry.verticesNeedUpdate = true;
                e.geometry.computeFaceNormals();
                delete e.geometry.__directGeometry
            });

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
export default CustomGeometry;
