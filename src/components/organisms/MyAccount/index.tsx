import * as React from 'react';
import MyAccountProfile from '@components/molecules/MyAccountProfile';
import MyAccountMenuList from '@components/molecules/MyAccountMenuList';
import { HeaderUser } from '../Header/types';

interface MyAccountProps {
  user: HeaderUser;
}

const MyAccount: React.FC<MyAccountProps> = ({ user }: MyAccountProps) => {
  return (
    <React.Fragment>
      <MyAccountProfile user={user} />
      <MyAccountMenuList user={user} />
    </React.Fragment>
  );
};

export default MyAccount;
