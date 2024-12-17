import React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import Box from '@components/layouts/Box';
import Popover from '@components/molecules/Popover';
import { NotificationsNoneIcon } from '@components/atoms/IconButton';
import { Text } from '@components/atoms/Text';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import { Notification } from '@components/molecules/NotificationList';

const NotificationList = dynamic(async () => import('@components/molecules/NotificationList'));

const PopoverHeaderContainer = styled(Box)`
  box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 0.19);
`;

interface NotificationPopoverProps extends WithTranslation {
  notifications: Notification[];
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ t, notifications }: NotificationPopoverProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const onIconClick = React.useCallback(
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
      anchor={<NotificationsNoneIcon color="label" size="24px" onClick={onIconClick} />}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box width="327px">
        <PopoverHeaderContainer width="100%" py={2} pl="11px">
          <Text mt={0} mb={0} fontSize="19px" letterSpacing={3} lineHeight="27px" fontWeight="bold">
            {t('Notifications')}
          </Text>
        </PopoverHeaderContainer>
        <Box height="365px" overflowY="scroll" pl="10px" pr="16px" py={2}>
          <NotificationList notifications={notifications} />
        </Box>
      </Box>
    </Popover>
  );
};

NotificationPopover.displayName = 'NotificationPopover';

export default withTranslation('common')(NotificationPopover);
