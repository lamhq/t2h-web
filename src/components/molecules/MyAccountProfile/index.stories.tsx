import React from 'react';
import MyAccountProfile from './index';

export default { title: 'Molecules|MyAccountProfile' };

export const Normal = () => {
  return <MyAccountProfile user={{ displayName: 'Taketo', profileImageUrl: '/static/images/1.jpg', membership: 'buyer' } as any} />;
};
