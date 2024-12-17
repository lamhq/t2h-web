import React from 'react';
import styled from 'styled-components';
import Balance from './index';

export default { title: 'Molecules|Balance' };

const Container = styled.div`
  width: 288px;
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

export const Standard = () => (
  <Container>
    <Balance iconColor="yellow" variant="small" amount={420} />
    <Balance iconColor="red" variant="normal" amount={420} caption="Current balance" />
  </Container>
);
