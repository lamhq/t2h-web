import styled from 'styled-components';
import { flexbox, space, layout, border, FlexboxProps, SpaceProps, LayoutProps, BorderProps } from 'styled-system';

export type FlexProps = FlexboxProps & SpaceProps & LayoutProps & BorderProps;

const Flex = styled.div<FlexProps>`
  ${flexbox}
  ${space}
  ${layout}
  ${border}
  display: flex;
`;

export default Flex;
