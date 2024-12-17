import * as React from 'react';
import styled from 'styled-components';
import { Notification } from '@components/molecules/NotificationList';
import UpperHeader from './UpperHeader';
import LowerHeader from './LowerHeader';
import { HeaderUser } from '../types';

const DesktopHeaderContainer = styled.div`
  width: 100%;
`;

interface DesktopHeaderProps {
  user?: HeaderUser;
  notifications: Notification[];
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ user, notifications }: DesktopHeaderProps) => {
  return (
    <DesktopHeaderContainer>
      <UpperHeader />
      <LowerHeader user={user} notifications={notifications} />
    </DesktopHeaderContainer>
  );
};

export default DesktopHeader;
