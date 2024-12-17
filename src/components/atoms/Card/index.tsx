import styled from 'styled-components';
import { color, layout, space, ColorProps, LayoutProps, SpaceProps } from 'styled-system';
import { theme } from '@components/global/theme';

type CardProps = ColorProps & LayoutProps & SpaceProps;

const Card = styled.div<CardProps>`
  ${color}
  ${layout}
  ${space}
  border-radius: 6px;
`;

Card.defaultProps = {
  backgroundColor: theme.colors.boxBackgroundColor,
};

export default Card;
