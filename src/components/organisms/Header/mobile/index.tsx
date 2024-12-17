import * as React from 'react';
import styled from 'styled-components';
import Topbar from './TopBar';
import Sidebar from './SideBar';
import { HeaderUser } from '../types';

export interface HeaderProps {
  user?: HeaderUser;
}

const HeaderRoot = styled(`header`)`
  top: 0;
  left: 0;
  width: 100%;
`;

const Header: React.FC<HeaderProps> = ({ user }: HeaderProps) => {
  const [isSideBarVisible, setIsSideBarVisible] = React.useState(false);
  const onMenuIconClick = React.useCallback(() => {
    setIsSideBarVisible((isSideBarVisible) => !isSideBarVisible);
  }, []);
  const isLogin = !!user;

  return (
    <HeaderRoot>
      <Topbar onMenuIconClick={onMenuIconClick} isSideBarVisible={isSideBarVisible} user={user} />
      <Sidebar isVisible={isSideBarVisible} isSeller={isLogin && !user.isBuyer} />
    </HeaderRoot>
  );
};

export default Header;
