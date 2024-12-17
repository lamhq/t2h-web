import * as React from 'react';
import Box from '@components/layouts/Box';
import MobileFooter from './mobile';
import DesktopFooter from './desktop';
import { FooterUser } from './types';

export interface FooterProps {
  user?: FooterUser;
}

const Footer: React.FC<FooterProps> = ({ user }: FooterProps) => {
  return (
    <>
      <Box display={{ _: 'block', md: 'none' }}>
        <MobileFooter user={user} />
      </Box>
      <Box display={{ _: 'none', md: 'block' }}>
        <DesktopFooter user={user} />
      </Box>
    </>
  );
};

export default Footer;
