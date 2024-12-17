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
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import RequestOtpForm from '@containers/RequestOtpForm';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';

const userApi = createApiClient(UserApi);
const { publicRuntimeConfig } = getConfig();

interface SellerRegisterRequestOtpPageProps extends WithTranslation {
  router: SingletonRouter;
}

const SellerRegisterRequestOtpPage: NextPage<SellerRegisterRequestOtpPageProps> = (props: SellerRegisterRequestOtpPageProps) => {
  const { t, router } = props;
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const handleComplete = useCallback(async () => {
    await router.push(`/seller/register/input-otp`);
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>{t('Seller Registration')}</title>
      </Head>
      <FormHeaderContainer>
        <Box width={{ _: 1, md: '720px' }}>
          <ResponsiveStepper
            currentStep={3}
            title={t(`Seller registration`)}
            steps={[t('Personal details'), t('Bank details'), t('Submit application')]}
          />
        </Box>
      </FormHeaderContainer>
      <Container>
        <RequestOtpForm userApi={userApi} recaptcha={recaptcha} onComplete={handleComplete} />
      </Container>
    </Layout>
  );
};

SellerRegisterRequestOtpPage.displayName = 'SellerRegisterRequestOtpPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SellerRegisterRequestOtpPage);
