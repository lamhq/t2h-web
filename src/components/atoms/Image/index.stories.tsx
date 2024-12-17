import React from 'react';
import { action } from '@storybook/addon-actions';
import Image from './index';

export default { title: 'Atoms|Image' };

export const Rect = () => (
  <React.Fragment>
    <Image width={'280px'} height={'280px'} src="/static/images/1.jpg" shape="rect" onClick={action('clicked')} />
    <Image width={'280px'} height={'280px'} src="/static/images/2.jpg" shape="rect" onClick={action('clicked')} />
    <Image width={'280px'} height={'280px'} src="/static/images/3.jpg" shape="rect" onClick={action('clicked')} />
  </React.Fragment>
);

export const Circle = () => (
  <React.Fragment>
    <Image width={'280px'} height={'280px'} src="/static/images/1.jpg" shape="circle" onClick={action('clicked')} />
    <Image width={'280px'} height={'280px'} src="/static/images/2.jpg" shape="circle" onClick={action('clicked')} />
    <Image width={'280px'} height={'280px'} src="/static/images/3.jpg" shape="circle" onClick={action('clicked')} />
  </React.Fragment>
);
