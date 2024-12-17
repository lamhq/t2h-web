import React from 'react';
import styled from 'styled-components';
import { variant, typography, color, space, TypographyProps, ColorProps, SpaceProps } from 'styled-system';
import { theme } from '@components/global/theme';
import Link, { LinkProps } from 'next/link';

export type TextVariant = 'extraSmall' | 'small' | 'medium' | 'mediumLarge' | 'large' | 'extraLarge';
export type TextProps = TypographyProps & ColorProps & SpaceProps & { variant?: TextVariant };

const variants = {
  extraSmall: {
    fontSize: 0,
    letterSpacing: 0,
    lineHeight: 0,
  },
  small: {
    fontSize: 1,
    letterSpacing: 1,
    lineHeight: 1,
  },
  medium: {
    fontSize: 2,
    letterSpacing: 2,
    lineHeight: 2,
  },
  mediumLarge: {
    fontSize: 3,
    letterSpacing: 3,
    lineHeight: 3,
  },
  large: {
    fontSize: 4,
    letterSpacing: 4,
    lineHeight: 4,
  },
  extraLarge: {
    fontSize: 5,
    letterSpacing: 5,
    lineHeight: 5,
  },
};

export const Text = styled.p<TextProps>`
  ${variant({ variants })}
  ${typography}
  ${color}
  ${space}
`;

Text.defaultProps = {
  variant: 'medium',
  color: 'text',
  fontFamily: 'primary',
};

type TextLinkInnerProps = TypographyProps & ColorProps & SpaceProps & { hoverColor?: string; visitedColor?: string; variant?: TextVariant };
type TextLinkProps = TextLinkInnerProps & Partial<LinkProps> & { children: React.ReactNode } & React.InputHTMLAttributes<HTMLAnchorElement>;

export const TextLabel = styled(Text.withComponent('span'))``;

// No margin, No padding
TextLabel.defaultProps = {
  m: 0,
  p: 0,
  variant: 'medium',
  color: 'text',
  fontFamily: 'primary',
};

export const TextLinkInner = styled.a<TextLinkInnerProps>`
  ${variant({ variants })}
  ${typography}
  ${color}
  ${space}
  text-decoration: underline;

  &:hover {
    cursor: pointer;
    color: ${({ hoverColor }) => hoverColor};
  }

  &:visited {
    color: ${({ visitedColor }) => visitedColor};
  }
`;

export const TextLink: React.FC<TextLinkProps> = (props: TextLinkProps) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { href, as, prefetch, passHref, replace, scroll, shallow, children, ...textRest } = props;

  if (href) {
    return (
      <Link href={href} as={as} prefetch={prefetch} passHref={passHref} scroll={scroll} shallow={shallow} replace={replace}>
        <TextLinkInner {...textRest}>{children}</TextLinkInner>
      </Link>
    );
  } else {
    return <TextLinkInner {...textRest}>{children}</TextLinkInner>;
  }
};

TextLink.defaultProps = {
  variant: 'small',
  color: 'link',
  fontFamily: 'primary',
  hoverColor: theme.colors.link,
  visitedColor: theme.colors.link,
};
