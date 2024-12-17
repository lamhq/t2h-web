import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import Link, { LinkProps } from 'next/link';

interface MenuItemProps extends SpaceProps, HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isSelected?: boolean;
}

const MenuItemWrapper = styled.div<SpaceProps & { isSelected?: boolean }>`
  display: flex;
  cursor: pointer;
  background-color: ${({ isSelected, theme }) => (isSelected ? theme.colors.selected : 'transparent')};
  ${space};

  &:hover {
    background-color: ${({ theme }) => theme.colors.selected};
  }
`;

const IconWrapper = styled.div`
  margin-right: 11px;
`;

export const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
  const { icon, children, ...rest } = props;

  return (
    <MenuItemWrapper {...rest}>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {children}
    </MenuItemWrapper>
  );
};

MenuItem.defaultProps = {
  p: 2,
};

type MenuItemLinkProps = MenuItemProps & LinkProps;

export const MenuItemLink: React.FC<MenuItemLinkProps> = (props: MenuItemLinkProps) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { href, as, replace, scroll, shallow, passHref, prefetch, children, ...rest } = props;

  return (
    <Link href={href} as={as} prefetch={prefetch} passHref={passHref} scroll={scroll} shallow={shallow} replace={replace}>
      <a>
        <MenuItem {...rest}>{children}</MenuItem>
      </a>
    </Link>
  );
};

MenuItemLink.defaultProps = {
  p: 2,
};
