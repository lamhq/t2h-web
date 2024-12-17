import React from 'react';
import styled from 'styled-components';
import Spinner from './index';

export default { title: 'Atoms|Spiner' };

const SpinnerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1199;
`;

export const Standard = () => (
  <SpinnerWrapper>
    <Spinner />
  </SpinnerWrapper>
);
