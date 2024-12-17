import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import { MenuItemLink } from '@components/atoms/MenuItem';
import { TextLabel } from '@components/atoms/Text';
import {
  MonetizationOnIcon,
  StarBorderIcon,
  PersonIcon,
  CardMembershipIcon,
  LockIcon,
  ExitToAppIcon,
  PublicIcon,
  RocketIcon,
  ListIcon,
  ShoppingCartIcon,
} from '@components/atoms/IconButton';
import { ButtonLink } from '@components/atoms/Button';
import Box from '@components/layouts/Box';

const menuItems = ['listing', 'coin', 'purchases', 'favorites', 'boosts', 'membership', 'profile', 'security'] as const;

export type MenuItemsType = typeof menuItems[number];

export const isMenuItemsType = (item: string): item is MenuItemsType => {
  return menuItems.findIndex((i) => i === item) !== -1;
};

interface MyAccountMenuListProps extends WithTranslation {
  user: { isBuyer: boolean; hashId: string };
  selectedItem?: MenuItemsType;
}

const FeaturedMenuList = styled.div`
  padding: 14px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MenuList = styled.div`
  padding: 14px;
`;

// TODO: Change MenuItemLink depending on user membership
const MyAccountMenuList: React.FC<MyAccountMenuListProps> = (props: MyAccountMenuListProps) => {
  const { t, user, selectedItem } = props;

  return (
    <React.Fragment>
      {!user.isBuyer && (
        <FeaturedMenuList>
          <MenuItemLink icon={<ListIcon />} isSelected={selectedItem === 'listing'} href="/myaccount/listing">
            <TextLabel variant="mediumLarge" color="menuText">
              {t('My listing')}
            </TextLabel>
          </MenuItemLink>
          <MenuItemLink icon={<PublicIcon />} href={`/u/${user.hashId}`}>
            <TextLabel variant="mediumLarge" color="menuText">
              {t('My public profile')}
            </TextLabel>
          </MenuItemLink>
        </FeaturedMenuList>
      )}
      <MenuList>
        {user.isBuyer && (
          <Box mb={4}>
            <ButtonLink href="/seller/register">{t('Become Seller')}</ButtonLink>
          </Box>
        )}
        {!user.isBuyer && (
          <React.Fragment>
            <MenuItemLink icon={<MonetizationOnIcon />} isSelected={selectedItem === 'coin'} href="/myaccount/coins">
              <TextLabel variant="mediumLarge" color="menuText">
                {t('Coins')}
              </TextLabel>
            </MenuItemLink>
            <MenuItemLink icon={<ShoppingCartIcon />} isSelected={selectedItem === 'purchases'} href="/myaccount/purchases">
              <TextLabel variant="mediumLarge" color="menuText">
                {t('My Purchases')}
              </TextLabel>
            </MenuItemLink>
            <MenuItemLink icon={<RocketIcon />} isSelected={selectedItem === 'boosts'} href="/myaccount/boosts">
              <TextLabel variant="mediumLarge" color="menuText">
                {t('Boost Schedule')}
              </TextLabel>
            </MenuItemLink>
          </React.Fragment>
        )}
        <MenuItemLink icon={<StarBorderIcon />} isSelected={selectedItem === 'favorites'} href="/myaccount/favorites">
          <TextLabel variant="mediumLarge" color="menuText">
            {t('Favorites')}
          </TextLabel>
        </MenuItemLink>
        <MenuItemLink icon={<PersonIcon />} isSelected={selectedItem === 'profile'} href="/myaccount/profile">
          <TextLabel variant="mediumLarge" color="menuText">
            {t('Profile details')}
          </TextLabel>
        </MenuItemLink>
        <MenuItemLink icon={<CardMembershipIcon />} isSelected={selectedItem === 'membership'} href="/myaccount/membership">
          <TextLabel variant="mediumLarge" color="menuText">
            {t('Membership')}
          </TextLabel>
        </MenuItemLink>
        <MenuItemLink icon={<LockIcon />} isSelected={selectedItem === 'security'} href="/myaccount/security">
          <TextLabel variant="mediumLarge" color="menuText">
            {t('Security & Account')}
          </TextLabel>
        </MenuItemLink>
        <MenuItemLink icon={<ExitToAppIcon />} href="/api/auth/token/revoke" prefetch={false}>
          <TextLabel variant="mediumLarge" color="menuText">
            {t('Sign out')}
          </TextLabel>
        </MenuItemLink>
      </MenuList>
    </React.Fragment>
  );
};

export default withTranslation('common')(MyAccountMenuList);
