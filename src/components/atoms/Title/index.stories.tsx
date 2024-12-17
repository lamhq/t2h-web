import React from 'react';
import { Title, SubTitle } from './index';

export default { title: 'Atoms|Title' };

export const withText = () => (
  <React.Fragment>
    <Title>Title</Title>
    <SubTitle>SubTitle</SubTitle>
  </React.Fragment>
);
