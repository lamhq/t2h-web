import * as React from 'react';
import { layout, space, LayoutProps, SpaceProps } from 'styled-system';
import { theme } from '@components/global/theme';
import styled from 'styled-components';

type HorizontalCollectionProps = LayoutProps & SpaceProps & { children?: React.ReactNode; itemSpacing?: number | string };

const HorizontalCollectionInner = styled.div<HorizontalCollectionProps>`
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  & > * {
    margin-right: ${({ itemSpacing }) => itemSpacing || theme.space[1]};
  }

  & > *:last-child {
    margin-right: 0px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  ${layout};
  ${space};
`;

const HorizontalCollection: React.FC<HorizontalCollectionProps> = ({ children, ...rest }: HorizontalCollectionProps) => {
  return <HorizontalCollectionInner {...rest}>{children}</HorizontalCollectionInner>;
};

HorizontalCollectionInner.defaultProps = {
  itemSpacing: theme.space[1],
};

export default HorizontalCollection;
