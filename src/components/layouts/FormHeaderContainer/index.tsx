import React from 'react';
import styled from 'styled-components';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';

const Container = styled(Box)`
  box-shadow: inset 0 -1px 0 0 #ececec;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.14);
  }
  box-sizing: border-box;
`;

const FormHeaderContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container width={1} pt={{ _: '12px', md: '28px' }} pb={{ _: '12px', md: '22px' }} px={3}>
      <Flex width={1} maxWidth={{ _: '100%', md: '1016px' }} mx={{ _: 0, md: 'auto' }}>
        {children}
      </Flex>
    </Container>
  );
};

export default FormHeaderContainer;
