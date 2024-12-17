import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import getConfig from 'next/config';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import { PersonalEditForm, ProfileImageEditForm, MobileEditForm, IndentityEditForm } from '@containers/ProfileEditForm';
import { withAuth, RedirectAction, withAuthServerSideProps, useAuthContext } from '@hocs/withAuth';
import { compose } from '@common/utils';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';

interface MyAccountProfilePageProps extends WithTranslation {
  router: SingletonRouter;
}

const { publicRuntimeConfig } = getConfig();
const userApi = createApiClient(UserApi);

const MyAccountProfilePage: NextPage<MyAccountProfilePageProps> = (props: MyAccountProfilePageProps) => {
  const { t } = props;
  const user = useAuthContext();
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';

  return (
    <Layout>
      <Head>
        <title>{t(`Profile details`)}</title>
      </Head>
      <MyAccountContainerLayout title={t('Profile details')} userApi={userApi}>
        <ProfileImageEditForm userApi={userApi} recaptcha={recaptcha} />
        <PersonalEditForm userApi={userApi} recaptcha={recaptcha} />
        <MobileEditForm requestOtpUrl="/myaccount/profile/request-otp" />
        {!user.isBuyer && <IndentityEditForm editIndentityUrl="/seller/register/personal" />}
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountProfilePage.displayName = 'MyAccountProfilePage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountProfilePage);
