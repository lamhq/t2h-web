import React from 'react';
import Image from '@components/atoms/Image';
import { action } from '@storybook/addon-actions';
import HorizontalCollection from './index';

export default { title: 'Atoms|HorizontalCollection' };

export const Standard = () => (
  <React.Fragment>
    <HorizontalCollection>
      {Array.from(Array(20), (_v, k) => {
        return (
          <Image width={'120px'} height={'120px'} src={`/static/images/${(k % 3) + 1}.jpg`} shape="rect" onClick={action('clicked')} />
        );
      })}
    </HorizontalCollection>
  </React.Fragment>
);

export const withItemSpacing = () => (
  <React.Fragment>
    <HorizontalCollection itemSpacing={'20px'}>
      {Array.from(Array(20), (_v, k) => {
        return (
          <Image width={'120px'} height={'120px'} src={`/static/images/${(k % 3) + 1}.jpg`} shape="rect" onClick={action('clicked')} />
        );
      })}
    </HorizontalCollection>
  </React.Fragment>
);
