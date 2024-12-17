import React from 'react';
import styled from 'styled-components';
import { variant, color, border, typography, layout, ColorProps, TypographyProps, BorderProps, LayoutProps } from 'styled-system';
import { safeKey } from '@common/utils';
import Link, { LinkProps } from 'next/link';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'facebook'
  | 'facebook_outlined'
  | 'line'
  | 'line_outlined'
  | 'omise'
  | 'transparent'
  | 'disabled'
  | 'success'
  | 'warning'
  | 'contact'
  | 'boosted'
  | 'white'
  | 'delete'
  | 'boost'
  | 'update'
  | 'boost';

export type ButtonProps = ColorProps &
  TypographyProps &
  BorderProps &
  LayoutProps & {
    variant?: ButtonVariant;
    block?: boolean;
  };

const variants = {
  primary: {
    color: '#ffffff',
    backgroundColor: '#1D3461',
    border: 'none',
  },
  secondary: {
    color: '#ffffff',
    backgroundColor: '#FF3C35',
    border: 'none',
  },
  facebook: {
    color: '#ffffff',
    backgroundColor: '#3B5998',
    border: '3px solid #3B5998',
  },
  facebook_outlined: {
    color: '#3B5998',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    border: '3px solid #3B5998',
  },
  line: {
    color: '#ffffff',
    backgroundColor: '#01c34d',
    border: '3px solid #01c34d',
  },
  line_outlined: {
    color: '#01c34d',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    border: '3px solid #01c34d',
  },
  omise: {
    color: '#ffffff',
    backgroundColor: '#1a62a4',
    border: 'none',
  },
  transparent: {
    color: '#8898aa',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    border: '1px solid #8898aa',
  },
  disabled: {
    color: '#ffffff',
    backgroundColor: '#a9a9a9',
    border: 'none',
  },
  success: {
    color: '#ffffff',
    backgroundColor: '#5AB203',
    border: 'none',
  },
  warning: {
    color: '#ffffff',
    backgroundColor: '#F98120',
    border: 'none',
  },
  contact: {
    color: '#ffffff',
    backgroundColor: '#FF3C35',
    border: 'none',
  },
  boost: {
    color: '#ffffff',
    backgroundColor: '#5AB203',
    border: 'none',
  },
  boosted: {
    color: '#ffffff',
    backgroundColor: '#FDCA40',
    border: 'none',
  },
  delete: {
    color: '#ffffff',
    backgroundColor: '#DB0605',
    border: 'none',
  },
  white: {
    color: '#333333',
    backgroundColor: '#ffffff',
    border: 'none',
  },
  update: {
    color: '#ffffff',
    backgroundColor: '#13CE66',
    border: 'none',
  },
};

const ButtonStyles = `
  border-radius: 19px;
  box-sizing: border-box;
  font-size: 14px;
  height: 38px;
  line-height: 22px;
  letter-spacing: 0;
  transition: all 0.3s ease-out;
  cursor: pointer;
  text-align: center;
  text-transform: none;
  touch-action: manipulation;

  &:focus {
    outline: none;
  }
`;

export const Button = styled.button<ButtonProps>`
  ${variant({ variants })}
  ${color}
  ${ButtonStyles}
  ${typography}
  ${border}
  ${layout}
  display: ${({ block = true }) => (block ? 'block' : 'inline-block')};
  width: ${({ block = true }) => (block ? '100%' : 'auto')};
  padding: ${({ block = true }) => (block ? '0' : '0 50px')};
`;

Button.defaultProps = {
  variant: 'primary',
  fontFamily: 'primary',
};

export type ButtonLinkProps = ButtonProps &
  Partial<LinkProps> & { children: React.ReactNode } & React.InputHTMLAttributes<HTMLAnchorElement>;

const StyledButtonLink = styled.a<ButtonProps>`
  ${variant({ variants })}
  ${color}
  ${ButtonStyles}
  ${typography}
  ${border}
  ${layout}
  display: ${({ block = true }) => (block ? 'block' : 'inline-block')};
  width: ${({ block = true }) => (block ? '100%' : 'auto')};
  padding: ${({ block = true }) => (block ? '0' : '0 50px')};
  line-height: 38px;
  &:hover,
  &:visited,
  &:active,
  &:link,
  &:focus {
    color: ${({ variant }) => variants[safeKey(variant)].color};
    text-decoration: none;
    border: ${({ variant }) => variants[safeKey(variant)].border};
  }
`;

export const ButtonLink: React.FC<ButtonLinkProps> = (props: ButtonLinkProps) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { href, as, prefetch, passHref, replace, scroll, shallow, children, ...buttonRest } = props;

  if (href) {
    return (
      <Link href={href} as={as} prefetch={prefetch} passHref={passHref} scroll={scroll} shallow={shallow} replace={replace}>
        <StyledButtonLink {...buttonRest}>{children}</StyledButtonLink>
      </Link>
    );
  } else {
    return <StyledButtonLink {...buttonRest}>{children}</StyledButtonLink>;
  }
};

ButtonLink.defaultProps = {
  variant: 'primary',
  fontFamily: 'primary',
};
