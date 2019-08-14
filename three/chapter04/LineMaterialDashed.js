/**
 * @file 多彩的线条
 */
import React from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { initStatus, initRenderer, initCamera, initTrackballControls, addHouseAndTree } from "../util/util";
import './style.scss';

class LineMaterialDashed extends React.Component {
    componentDidMount(){
        this.init(this.threeNode);
    }
    componentWillUnmount(){
        this.gui.destroy();
    }
    init = targetNode => {
        // 初始化基础对象
        const renderer = initRenderer(targetNode);// 绑定dom并返回renderer
        const camera = initCamera();
        const scene = new THREE.Scene();
        // 全局光
        const ambientLight = new THREE.AmbientLight(0x0c0c0c);
        scene.add(ambientLight);
        // 聚光灯
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        const points = gosper(4, 60);

        const lines = new THREE.Geometry();
        const colors = [];
        let i = 0;
        points.forEach(e => {
            lines.vertices.push(new THREE.Vector3(e.x, e.z, e.y));
            colors[i] = new THREE.Color(0xffffff);
            colors[i].setHSL(e.x / 100 + 0.5, (e.y * 20) / 300, 0.8);
            i ++;
        });

        lines.colors = colors;
        const material = new THREE.LineDashedMaterial({
            vertexColors: true,
            color: 0xffffff,
            dashSize: 2,
            gapSize: 2,
            scale: 0.1
        });

        const line = new THREE.Line(lines, material);
        line.position.set(25, -30, -60);
        scene.add(line);
        // 添加对象
        // addHouseAndTree(scene);
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
        let step = 0;
        function threeRender() {
            stats.update();
            trackballControls.update(clock.getDelta());

            line.rotation.z = step += 0.01;
            requestAnimationFrame(threeRender);
            renderer.render(scene, camera);
        }
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function gosper(a, b) {

            var turtle = [0, 0, 0];
            var points = [];
            var count = 0;
        
            rg(a, b, turtle);
        
        
            return points;
        
            function rt(x) {
              turtle[2] += x;
            }
        
            function lt(x) {
              turtle[2] -= x;
            }
        
            function fd(dist) {
              //                ctx.beginPath();
              points.push({
                x: turtle[0],
                y: turtle[1],
                z: Math.sin(count) * 5
              });
              //                ctx.moveTo(turtle[0], turtle[1]);
        
              var dir = turtle[2] * (Math.PI / 180);
              turtle[0] += Math.cos(dir) * dist;
              turtle[1] += Math.sin(dir) * dist;
        
              points.push({
                x: turtle[0],
                y: turtle[1],
                z: Math.sin(count) * 5
              });
              //                ctx.lineTo(turtle[0], turtle[1]);
              //                ctx.stroke();
        
            }
        
            function rg(st, ln, turtle) {
        
              st--;
              ln = ln / 2.6457;
              if (st > 0) {
                //                    ctx.strokeStyle = '#111';
                rg(st, ln, turtle);
                rt(60);
                gl(st, ln, turtle);
                rt(120);
                gl(st, ln, turtle);
                lt(60);
                rg(st, ln, turtle);
                lt(120);
                rg(st, ln, turtle);
                rg(st, ln, turtle);
                lt(60);
                gl(st, ln, turtle);
                rt(60);
              }
              if (st == 0) {
                fd(ln);
                rt(60);
                fd(ln);
                rt(120);
                fd(ln);
                lt(60);
                fd(ln);
                lt(120);
                fd(ln);
                fd(ln);
                lt(60);
                fd(ln);
                rt(60)
              }
            }
        
            function gl(st, ln, turtle) {
              st--;
              ln = ln / 2.6457;
              if (st > 0) {
                //                    ctx.strokeStyle = '#555';
                lt(60);
                rg(st, ln, turtle);
                rt(60);
                gl(st, ln, turtle);
                gl(st, ln, turtle);
                rt(120);
                gl(st, ln, turtle);
                rt(60);
                rg(st, ln, turtle);
                lt(120);
                rg(st, ln, turtle);
                lt(60);
                gl(st, ln, turtle);
              }
              if (st == 0) {
                lt(60);
                fd(ln);
                rt(60);
                fd(ln);
                fd(ln);
                rt(120);
                fd(ln);
                rt(60);
                fd(ln);
                lt(120);
                fd(ln);
                lt(60);
                fd(ln);
              }
            }
          }
    }
    render(){
        return <div ref={node => {this.threeNode = node}}></div>
    }
}

export default LineMaterialDashed;
