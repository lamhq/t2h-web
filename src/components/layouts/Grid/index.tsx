import styled from 'styled-components';
import { grid, layout, space, flexbox, GridProps, LayoutProps, SpaceProps, FlexboxProps } from 'styled-system';

const Grid = styled.div<GridProps & LayoutProps & SpaceProps & FlexboxProps>`
  ${grid}
  ${layout}
  ${space}
  ${flexbox}
`;

export default Grid;
