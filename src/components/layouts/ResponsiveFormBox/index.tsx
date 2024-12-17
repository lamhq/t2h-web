import React from 'react';
import Box, { BoxProps } from '@components/layouts/Box';
import Flex, { FlexProps } from '@components/layouts/Flex';

export const ResponsiveFormContainer = ({ children, ...rest }: { children: React.ReactNode } & FlexProps) => {
  return (
    <Flex flexDirection={{ _: 'column', md: 'row' }} {...rest}>
      {children}
    </Flex>
  );
};

export const ResponsiveFormItem = ({ children, ...rest }: { children: React.ReactNode } & Omit<BoxProps, 'color'>) => {
  return (
    <Box width={{ _: 1, md: '50%' }} {...rest}>
      {children}
    </Box>
  );
};

export const ResponsiveFormDescription = ({ children, ...rest }: { children: React.ReactNode } & Omit<BoxProps, 'color'>) => {
  return (
    <Box width={{ _: 1, md: '43.5%' }} ml={{ _: '', md: 'auto' }} {...rest}>
      {children}
    </Box>
  );
};
