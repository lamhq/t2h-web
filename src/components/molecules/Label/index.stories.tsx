import React from 'react';
import styled from 'styled-components';
import { theme } from '@components/global/theme';
import Label from './index';

export default { title: 'Molecules|Label' };

const Container = styled.div`
  width: 500px;
  padding: 20px;
`;

export const Standard = () => (
  <Container>
    <Label m={2} label="Buyer" />
    <Label m={2} label="Seller" />
  </Container>
);

export const ChangeColor = () => (
  <Container>
    <Label backgroundColor={theme.colors.placeholder} fontColor={theme.colors.black} m={2} label="Buyer" />
    <Label backgroundColor={theme.colors.danger} fontColor={theme.colors.white} m={2} label="Seller" />
  </Container>
);
