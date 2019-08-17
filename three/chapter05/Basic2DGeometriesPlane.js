import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addLargeGroundPlane, initDefaultLighting, applyMeshNormalMaterial } from "../util/util";
import './style.scss';

class Basic2DGeometriesPlane extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    componentWillUnmount(){
        this.gui.destroy();
    }
    init = targetNode => {
        // console.log('applyMeshNormalMaterial :', applyMeshNormalMaterial);
        
        // 初始化基础对象
        const renderer = initRenderer(targetNode);// 绑定dom并返回renderer
        const camera = initCamera();
        const scene = new THREE.Scene();
        const groundPlane = addLargeGroundPlane(scene);
        groundPlane.position.y = -10;
        initDefaultLighting(scene);

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
        function setupControls(gui) {
            const controls = new function() {
                this.appliedMaterial = applyMeshNormalMaterial;
                this.castShadow = true;
                this.groundPlaneVisible = true;

                this.planeGeometry = new THREE.PlaneGeometry(20, 20, 4, 4);
                this.width = this.planeGeometry.parameters.width;
                this.height = this.planeGeometry.parameters.height;
                this.widthSegments = this.planeGeometry.parameters.widthSegments;
                this.heightSegments = this.planeGeometry.parameters.heightSegments;

                // this.redraw = function() {

                // }
            }
            // gui.add(controls, 'width', 0, 40).onChange(controls)
            return controls;
        }
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}

export default Basic2DGeometriesPlane;