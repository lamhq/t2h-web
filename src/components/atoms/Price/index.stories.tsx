import React from 'react';
import styled from 'styled-components';
import Price from './index';

const Container = styled.div`
  margin: 20px;
`;

export default { title: 'Atoms|Price' };

export const Normal = () => {
  return (
    <Container>
      <Price title="Asking Price" price="742,000 THB" />
    </Container>
  );
};
