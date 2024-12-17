import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import Dialog from '@components/molecules/Dialog';
import Alert from '@components/molecules/Alert';
import { CheckCircleIcon } from '@components/atoms/IconButton';
import InputOtpForm from '@containers/InputOtpForm';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';

const userApi = createApiClient(UserApi);

interface SellerRegisterInputOtpPageProps extends WithTranslation {
  router: SingletonRouter;
}

const SellerRegisterInputOtpPage: NextPage<SellerRegisterInputOtpPageProps> = (props: SellerRegisterInputOtpPageProps) => {
  const { t, router } = props;
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);

  const onPopupClose = React.useCallback(() => {
    setIsPopupVisible(false);
  }, [setIsPopupVisible]);

  const onFinishButtonClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push('/');
    },
    [router],
  );

  const handleComplete = React.useCallback((error?: Error) => {
    if (!error) {
      setIsPopupVisible(true);
    }
  }, []);

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
        <InputOtpForm userApi={userApi} onComplete={handleComplete} requestOtpUrl={`/seller/register/request-otp`} />
      </Container>

      <Dialog
        isOpen={isPopupVisible}
        onClose={onPopupClose}
        showsTitle={true}
        showsCloseIcon={false}
        showsActionButton={true}
        title={t(`Number verification`)}
        actionLabel={t(`Finished`)}
        onActionClick={onFinishButtonClick}
      >
        <Box mb="103px">
          <Alert
            icon={<CheckCircleIcon size="120px" color="success" />}
            title={t(`You’ve successfully confirmed your number`)}
            descriptions={[t(`You can change your number later in your account.`)]}
          />
        </Box>
      </Dialog>
    </Layout>
  );
};

SellerRegisterInputOtpPage.displayName = 'SellerRegisterInputOtpPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SellerRegisterInputOtpPage);
