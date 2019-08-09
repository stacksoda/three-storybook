import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import {BaseEnv, AddLight, BaseAnimation, BasicScene, FogScene, OverrideMaterial} from '../three';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with emoji', () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));   
storiesOf('THREEjs', module)
    .add('base env', () => (
        <BaseEnv />
    ))
    .add('add light', () => (
      <AddLight />
    ))
    .add('animation', () => (
      <BaseAnimation />
    ))
    .add('scene', () => (
      <BasicScene />
    ))
    .add('FogScene', () => (
      <FogScene />
    ))
    .add('OverrideMaterial', () => (
      <OverrideMaterial />
    ))