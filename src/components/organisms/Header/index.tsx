import * as React from 'react';
import Box from '@components/layouts/Box';
import { Notification } from '@components/molecules/NotificationList';
import MobileHeader from './mobile';
import DesktopHeader from './desktop';
import { HeaderUser } from './types';

export interface HeaderProps {
  user?: HeaderUser;
  notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ user, notifications }: HeaderProps) => {
  return (
    <>
      <Box display={{ _: 'block', md: 'none' }}>
        <MobileHeader user={user} />
      </Box>
      <Box display={{ _: 'none', md: 'block' }}>
        <DesktopHeader user={user} notifications={notifications} />
      </Box>
    </>
  );
};

export default Header;
