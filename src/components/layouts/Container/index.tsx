import styled from 'styled-components';
import { layout, space, LayoutProps, SpaceProps } from 'styled-system';

type ContainerProps = LayoutProps & SpaceProps;

const Container = styled.div<ContainerProps>`
  ${layout}
  ${space}
  box-sizing: border-box;
`;

Container.defaultProps = {
  minHeight: { _: '0px', md: '484px' },
  padding: { _: 3, md: 5 },
};

export default Container;
