import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import { 
  BaseEnv, 
  AddLight, 
  BaseAnimation, 
  BasicScene, 
  FogScene, 
  OverrideMaterial, 
  CustomGeometry, 
  MeshProperties, 
  BothCamera, 
  CameraLookAt, 
  AmbientLight,
  SpotLight,
  PointLight,
  DirectionalLight,
  HemisphereLight,
  AreaLight,
  Lensflares,
  BaseMeshMaterial,
  DepthMaterial,
  CombinedMaterial,
  MeshNormalMaterial,
  MeshFaceMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshToonMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  // ShaderMaterial,
  LineMaterial,
  LineMaterialDashed,
} from '../three';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with emoji', () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));
storiesOf('THREEjs.chapter01', module)
  .add('base env', () => (
    <BaseEnv />
  ))
  .add('add light', () => (
    <AddLight />
  ))
  .add('animation', () => (
    <BaseAnimation />
  ));
storiesOf('THREEjs.chapter02', module)
  .add('baseScene', () => (
    <BasicScene />
  ))
  .add('FogScene', () => (
    <FogScene />
  ))
  .add('OverrideMaterial', () => (
    <OverrideMaterial />
  ))
  .add('CustomGeometry', () => (
    <CustomGeometry />
  ))
  .add('MeshProperties', () => (
    <MeshProperties />
  ))
  .add('BothCamera', () => (
    <BothCamera />
  ))
  .add('CameraLookAt', () => (
    <CameraLookAt />
  ))
storiesOf('THREEjs.chapter03', module)
  .add('AmbientLight', () => (
    <AmbientLight />
  ))
  .add('SpotLight', () => (
    <SpotLight />
  ))
  .add('PointLight', () => (
    <PointLight />
  ))
  .add('DirectionalLight', () => (
    <DirectionalLight />
  ))
  .add('HemisphereLight', () => (
    <HemisphereLight />
  ))
  .add('AreaLight', () => (
    <AreaLight />
  ))
  .add('Lensflares', () => (
    <Lensflares />
  ));
storiesOf('THREEjs.chapter04', module)
  .add('BaseMeshMaterial', () => (
    <BaseMeshMaterial />
  ))
  .add('DepthMaterial', () => (
    <DepthMaterial />
  ))
  .add('CombinedMaterial', () => (
    <CombinedMaterial />
  ))
  .add('MeshNormalMaterial', () => (
    <MeshNormalMaterial />
  ))
  .add('MeshFaceMaterial', () => (
    <MeshFaceMaterial />
  ))
  .add('MeshLambertMaterial', () => (
    <MeshLambertMaterial />
  ))
  .add('MeshPhongMaterial', () => (
    <MeshPhongMaterial />
  ))
  .add('MeshToonMaterial', () => (
    <MeshToonMaterial />
  ))
  .add('MeshStandardMaterial', () => (
    <MeshStandardMaterial />
  ))
  .add('MeshPhysicalMaterial', () => (
    <MeshPhysicalMaterial />
  ))
  // .add('ShaderMaterial', () => (
  //   <ShaderMaterial />
  // ))
  .add('LineMaterial', () => (
    <LineMaterial />
  ))
  .add('LineMaterialDashed', () => (
    <LineMaterialDashed />
  ))