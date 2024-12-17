import React, { useCallback } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import Head from 'next/head';
import getConfig from 'next/config';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import Layout from '@containers/Layout';
import RequestOtpForm from '@containers/RequestOtpForm';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import { SubTitle } from '@components/atoms/Title';
import Link from 'next/link';
import IconTextLink from '@components/molecules/IconTextLink';
import { ArrowBackIcon } from '@components/atoms/IconButton';

const userApi = createApiClient(UserApi);
const { publicRuntimeConfig } = getConfig();

interface MyAccountProfileRequestOtpPageProps extends WithTranslation {
  router: SingletonRouter;
}

const MyAccountProfileRequestOtpPage: NextPage<MyAccountProfileRequestOtpPageProps> = (props: MyAccountProfileRequestOtpPageProps) => {
  const { t, router } = props;
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const handleComplete = useCallback(async () => {
    await router.push(`/myaccount/profile/input-otp`);
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>{t('Profile details')}</title>
      </Head>
      <MyAccountContainerLayout title={t('Profile details')} userApi={userApi}>
        <Link href="/myaccount/profile">
          <IconTextLink icon={<ArrowBackIcon size="14px" />}>{t('Back')}</IconTextLink>
        </Link>
        <SubTitle textAlign="left">{t('Change your mobile')}</SubTitle>
        <RequestOtpForm userApi={userApi} recaptcha={recaptcha} onComplete={handleComplete} />
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountProfileRequestOtpPage.displayName = 'MyAccountProfileRequestOtpPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountProfileRequestOtpPage);
