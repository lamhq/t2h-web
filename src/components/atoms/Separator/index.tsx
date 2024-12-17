import * as React from 'react';
import styled from 'styled-components';
import { border, layout, color, space, ColorProps, SpaceProps, LayoutProps, BorderProps } from 'styled-system';

interface SeparatorProps extends LayoutProps, ColorProps, SpaceProps, BorderProps {
  children?: React.ReactNode;
}

const getMargin = ({ children }: SeparatorProps) => (children ? '.50em' : '');

const Separator = styled.div<SeparatorProps>`
  ${layout}
  ${color}
  ${space}
  display: flex;
  align-items: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    ${border}
  }

  &::before {
    margin-right: ${getMargin};
  }

  &::after {
    margin-left: ${getMargin};
  }
`;

Separator.defaultProps = {
  height: '22px',
  color: 'separator',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'separatorBorder',
};

export default Separator;
