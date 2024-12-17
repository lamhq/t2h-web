import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { CloseIcon } from '@components/atoms/IconButton';
import styled from 'styled-components';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { useNotifications } from '@hocs/withNotification';
import { createApiClient } from '@services/core';
import { NotificationApi } from '@services/apis';

const NotificationList = dynamic(async () => import('@components/molecules/NotificationList'));

const notificationApi = createApiClient(NotificationApi);

const TopBar = styled.div`
  height: 48px;
  padding: 0 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.12);
  background-color: #fff;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
`;

const Wrapper = styled.div`
  padding-top: 48px;
`;

interface NotificationPageProps extends WithTranslation {}

const NotificationPage: React.FC<WithTranslation> = ({ t }: NotificationPageProps) => {
  const notifications = useNotifications(notificationApi);

  return (
    <>
      <Head>
        <title>{t('Notifications')}</title>
      </Head>
      <TopBar>
        {t('Notifications')} <CloseIcon />
      </TopBar>
      <Container>
        <Wrapper>
          <NotificationList notifications={notifications} />
        </Wrapper>
      </Container>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withTranslation('common'), withAuth], NotificationPage);
