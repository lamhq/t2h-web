import * as React from 'react';
import styled from 'styled-components';
import { typography, color, space, TypographyProps, SpaceProps, ColorProps } from 'styled-system';
import { theme } from '@components/global/theme';

type LinkContainerProps = { cursor?: string } & TypographyProps & ColorProps & SpaceProps;

const LinkContainer = styled.a<LinkContainerProps>`
  ${color}
  ${typography}
  ${space}
  display: flex;
  align-items: center;
  cursor: ${({ cursor }) => cursor ?? 'auto'};
`;

LinkContainer.defaultProps = {
  fontSize: theme.fontSizes[1],
  fontFamily: theme.fonts.link,
  color: theme.colors.text,
  lineHeight: theme.lineHeights[1],
};

interface IconTextLinkProps extends React.HTMLAttributes<HTMLElement> {
  icon?: JSX.Element;
  children?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const IconTextLink: React.FC<IconTextLinkProps> = (props: IconTextLinkProps) => {
  const { icon, children, onClick } = props;
  const cursor = onClick ? 'pointer' : '';

  return (
    <LinkContainer cursor={cursor} onClick={onClick}>
      {icon}&nbsp;
      {children}
    </LinkContainer>
  );
};

export default IconTextLink;
