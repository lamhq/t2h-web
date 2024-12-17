import React from 'react';
import styled from 'styled-components';
import Box from '@components/layouts/Box';
import Image from '@components/atoms/Image';
import Popover from '@components/molecules/Popover';
import MyAccountProfile from '@components/molecules/MyAccountProfile';
import MyAccountMenuList from '@components/molecules/MyAccountMenuList';
import LetterAvatar from '@components/atoms/LetterAvatar';
import { HeaderUser } from '../types';

const ImageIcon = styled(Image)`
  cursor: pointer;
`;

interface AccountPopoverProps {
  user: HeaderUser;
}

const AccountPopover = ({ user }: AccountPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const onImageClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsPopoverOpen((isOpen) => !isOpen);
    },
    [setIsPopoverOpen],
  );
  const onClose = React.useCallback(() => {
    setIsPopoverOpen(false);
  }, [setIsPopoverOpen]);

  return (
    <Popover
      open={isPopoverOpen}
      style={{ borderRadius: '8px' }}
      onClose={onClose}
      anchor={
        user.profileImageUrl ? (
          <ImageIcon shape="circle" width="34px" height="34px" src={user.profileImageUrl} onClick={onImageClick} />
        ) : (
          <LetterAvatar firstName={user.firstName} lastName={user.lastName} width={34} height={34} onClick={onImageClick} />
        )
      }
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
      <Box width="272px" py={3}>
        <MyAccountProfile user={user} />
        <MyAccountMenuList user={user} />
      </Box>
    </Popover>
  );
};

export default AccountPopover;
