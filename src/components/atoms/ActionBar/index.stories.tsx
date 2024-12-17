import React from 'react';
import Box from '@components/layouts/Box';
import { Button } from '../Button';
import ActionBar from './index';

export default { title: 'Atoms|ActionBar' };

export const Standard = () => (
  <ActionBar p="10px">
    <Box mb={1}>
      <Button variant="primary">Apply filter</Button>
    </Box>
    <Box>
      <Button variant="transparent">Cancel</Button>
    </Box>
  </ActionBar>
);

export const withAnimation = () => (
  <ActionBar p="10px" isAnimated={true}>
    <Box mb={1}>
      <Button variant="primary">Apply filter</Button>
    </Box>
    <Box>
      <Button variant="transparent">Cancel</Button>
    </Box>
  </ActionBar>
);

export const PositionTopwithAnimation = () => (
  <ActionBar p="10px" position="top" isAnimated={true}>
    <Box mb={1}>
      <Button variant="primary">Apply filter</Button>
    </Box>
    <Box>
      <Button variant="transparent">Cancel</Button>
    </Box>
  </ActionBar>
);
