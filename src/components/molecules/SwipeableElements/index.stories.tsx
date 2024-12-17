import React from 'react';
import Image from '@components/atoms/Image';
import Card from '@components/atoms/Card';
import SwipeableElements from './';

export default { title: 'Molecules|SwipeableElements' };

export const SwipeImage = () => {
  return (
    <SwipeableElements width="280px" height="280px" my={4} ml="250px" onChangePosition={console.log}>
      <Image width={'280px'} height={'280px'} src="/static/images/1.jpg" shape="rect" />
      <Image width={'280px'} height={'280px'} src="/static/images/2.jpg" shape="rect" />
      <Image width={'280px'} height={'280px'} src="/static/images/3.jpg" shape="rect" />
    </SwipeableElements>
  );
};

export const SwipeBox = () => {
  return (
    <SwipeableElements width="280px" height="280px" my={4} ml="250px" onChangePosition={console.log}>
      <Card width={'280px'} height={'280px'} backgroundColor="primary" />
      <Card width={'280px'} height={'280px'} backgroundColor="success" />
      <Card width={'280px'} height={'280px'} backgroundColor="warning" />
    </SwipeableElements>
  );
};
