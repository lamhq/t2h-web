import React from 'react';
import MyAccount from './index';

export default { title: 'Organisms|MyAccount' };

export const Normal = () => {
  const user = {
    hashId: '11111111',
    roles: ['seller'],
    isBuyer: false,
    displayName: 'Taketo',
    profileImageUrl: '/static/images/1.jpg',
    membership: 'buyer',
  };

  return <MyAccount user={user as any} />;
};
