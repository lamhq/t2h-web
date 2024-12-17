import React from 'react';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { OuterTitle } from '@components/atoms/Title';
import breakpoints from '@components/global/breakpoints';

const MyAccountTitle = ({ children }: { children: React.ReactNode }) => (
  <Flex borderBottom="solid 1px #f3f3f3" justifyContent="center">
    <Box width={{ _: 1, lg: breakpoints.lg }}>
      <OuterTitle>{children}</OuterTitle>
    </Box>
  </Flex>
);

export default MyAccountTitle;
