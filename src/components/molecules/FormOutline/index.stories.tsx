import React from 'react';
import styled from 'styled-components';
import { HelpOutlineIcon } from '@components/atoms/IconButton';
import FormOutline from './';

export default { title: 'Molecules|FormOutline' };

const Container = styled.div`
  width: 288px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
`;

export const Standard = () => (
  <Container>
    <FormOutline outline={`Photo of company certificate`} />
    <FormOutline outline={`Bank details　*`} icon={<HelpOutlineIcon size="16px" color="helpIcon" />} />
  </Container>
);
