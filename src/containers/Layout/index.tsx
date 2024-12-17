import React from 'react';
import Header from '@components/organisms/Header';
import Footer from '@components/organisms/Footer';
import { useAuthContext } from '@hocs/withAuth';
import { useNotifications } from '@hocs/withNotification';
import { createApiClient } from '@services/core';
import { NotificationApi } from '@services/apis';

const notificationApi = createApiClient(NotificationApi);

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC = (props: LayoutProps) => {
  const user = useAuthContext();
  const notifications = useNotifications(notificationApi);

  return (
    <div id="layout">
      <Header user={user} notifications={notifications} />
      <main>{props.children}</main>
      <Footer user={user} />
    </div>
  );
};

export default Layout;
