import React from 'react';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Location from './index';

export default { title: 'Molecules|Location' };

const Container = styled(Flex)`
  width: 200px;
  &:not:(first-child) {
    margin-top: 16px;
  }
`;

export const Standard = () => {
  return (
    <Container flexDirection="column">
      <Location location="185 Sukhumvit Rd, Khlong Toei Nuea, Watthana, Bangkok 10110" />
      <Location location="Office" />
    </Container>
  );
};
