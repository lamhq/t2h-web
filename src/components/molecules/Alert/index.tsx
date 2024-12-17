import * as React from 'react';
import styled from 'styled-components';
import { color, layout, flexbox, LayoutProps, ColorProps, FlexboxProps } from 'styled-system';
import { theme } from '@components/global/theme';
import { Text } from '@components/atoms/Text';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';

interface AlertProps extends React.HTMLAttributes<HTMLElement> {
  icon?: JSX.Element;
  title?: string;
  descriptions?: string[];
}

type IconContainerProps = ColorProps & LayoutProps & FlexboxProps;

const IconContainer = styled.div<IconContainerProps>`
  ${color}
  ${layout}
  ${flexbox}
  display: flex;
  border-radius: 100%;
`;

IconContainer.defaultProps = {
  backgroundColor: theme.colors.boxBackgroundColor,
  width: '120px',
  height: '120px',
  alignItems: 'center',
  justifyContent: 'center',
};

const Alert: React.FC<AlertProps> = (props: AlertProps) => {
  const { icon, title, descriptions } = props;

  return (
    <Flex flexWrap="wrap" flexDirection="column" alignItems="center">
      {icon && <IconContainer>{icon}</IconContainer>}
      {title && (
        <Text mt={3} mb={0} variant="large" color="secondary">
          {title}
        </Text>
      )}
      {descriptions && (
        <Box>
          {descriptions.map((d, i) => (
            <Text key={i} mt={3} mb={0} variant="medium" color="secondary" textAlign="center">
              {d}
            </Text>
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default Alert;
