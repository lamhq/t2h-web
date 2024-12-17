import React from 'react';
import Card from './index';

export default { title: 'Atoms|Card' };

export const Standard = () => (
  <React.Fragment>
    <p>Give width and height</p>
    <Card width={'120px'} height={'120px'} />
    <p>Give background color</p>
    <Card width={'240px'} height={'120px'} backgroundColor={'black'} />
    <p>Wrap with parent div</p>
    <div style={{ width: '150px', height: '150px' }}>
      <Card backgroundColor={'yellow'} />
    </div>
  </React.Fragment>
);
