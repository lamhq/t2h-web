import React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Indicator from './';

export default { title: 'Molecules|Indicator' };

const Container = styled(Flex)`
  margin: 16px;
  &:not:(:first-child) {
    margin-top: 16px;
  }
`;

export const Standard = () => {
  return (
    <Container flexDirection="column">
      <Indicator index={0} number={5} color="black" />
      <Indicator index={2} number={5} color="black" />
      <Indicator index={4} number={5} color="black" />
    </Container>
  );
};
