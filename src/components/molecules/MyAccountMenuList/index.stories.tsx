import React from 'react';
import MyAccountMenuList from './index';

export default { title: 'Molecules|MyAccountMenuList' };

export const Buyer = () => {
  const user = {
    hashId: '11111111',
    roles: ['buyer'],
    isBuyer: true,
  };

  return <MyAccountMenuList user={user as any} />;
};

export const Seller = () => {
  const user = {
    hashId: '11111111',
    roles: ['seller'],
    isBuyer: false,
  };

  return <MyAccountMenuList user={user as any} />;
};
