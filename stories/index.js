import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import { BaseEnv, AddLight, BaseAnimation, BasicScene, FogScene, OverrideMaterial, CustomGeometry, MeshProperties, BothCamera, CameraLookAt, AmbientLight } from '../three';

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