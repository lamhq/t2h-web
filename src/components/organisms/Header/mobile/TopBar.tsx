import * as React from 'react';
import styled from 'styled-components';
import Image from '@components/atoms/Image';
import { MenuIcon, CloseIcon, SearchIcon, NotificationsNoneIcon, AccountCircleIcon } from '@components/atoms/IconButton';
import LetterAvatar from '@components/atoms/LetterAvatar';
import Link from 'next/link';
import { MobileAppLogo } from '@components/atoms/AppLogo';
import { HeaderUser } from '../types';

export interface TopBarProps {
  onMenuIconClick: React.MouseEventHandler;
  isSideBarVisible: boolean;
  user?: HeaderUser;
}

const TopBarRoot = styled.nav`
  background: #ffffff;
  border-bottom: solid 1px #ececec;
  height: 48px;
  position: sticky;
  z-index: 1000;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuIconContainer = styled.div`
  position: absolute;
  left: 0;
  margin-left: 21px;
`;

const RightIconsContainer = styled.div`
  position: absolute;
  right: 0;
  margin-right: 14px;
  display: flex;
  align-items: center;
  height: 30px;
`;

const RightIconsContainerItem = styled.div<{ height?: string }>`
  width: 24px;
  height: ${({ height }) => height || '24px'};
  align-self: center;
  margin-right: 17px;
  &:last-child {
    margin-right: 0px;
  }
`;

const StyledImage = styled(Image)`
  cursor: pointer;
`;

const TopBar: React.FC<TopBarProps> = (props: TopBarProps) => {
  const { user, onMenuIconClick, isSideBarVisible } = props;

  return (
    <TopBarRoot>
      <MenuIconContainer>
        {isSideBarVisible ? <CloseIcon onClick={onMenuIconClick} /> : <MenuIcon onClick={onMenuIconClick} />}
      </MenuIconContainer>
      <Link href="/">
        <a>
          <MobileAppLogo width={45} height={32} />
        </a>
      </Link>
      <RightIconsContainer>
        <RightIconsContainerItem>
          <Link href="/search">
            <a>
              <SearchIcon size="24px" />
            </a>
          </Link>
        </RightIconsContainerItem>
        <RightIconsContainerItem height="26px">
          <Link href="/notification">
            <a>
              <NotificationsNoneIcon size="24px" />
            </a>
          </Link>
        </RightIconsContainerItem>
        <RightIconsContainerItem>
          {(() => {
            if (user && user.profileImageUrl) {
              return (
                <Link href="/myaccount">
                  <a>
                    <StyledImage shape="circle" width="24px" height="24px" src={user.profileImageUrl} />
                  </a>
                </Link>
              );
            } else if (user && !user.profileImageUrl) {
              return (
                <Link href="/myaccount">
                  <a>
                    <LetterAvatar firstName={user.firstName} lastName={user.lastName} />
                  </a>
                </Link>
              );
            } else {
              return (
                <Link href="/signin">
                  <a>
                    <AccountCircleIcon size="24px" />
                  </a>
                </Link>
              );
            }
          })()}
        </RightIconsContainerItem>
      </RightIconsContainer>
    </TopBarRoot>
  );
};

export default TopBar;
