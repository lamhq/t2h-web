import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import Layout from '@containers/Layout';
import Box from '@components/layouts/Box';
import Dialog from '@components/molecules/Dialog';
import Alert from '@components/molecules/Alert';
import { CheckCircleIcon, ArrowBackIcon } from '@components/atoms/IconButton';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import InputOtpForm from '@containers/InputOtpForm';
import { SubTitle } from '@components/atoms/Title';
import IconTextLink from '@components/molecules/IconTextLink';

const userApi = createApiClient(UserApi);

interface MyAccountProfileInputOtpPageProps extends WithTranslation {
  router: SingletonRouter;
}

const MyAccountProfileInputOtpPage: NextPage<MyAccountProfileInputOtpPageProps> = (props: MyAccountProfileInputOtpPageProps) => {
  const { t, router } = props;
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);

  const onPopupClose = React.useCallback(() => {
    setIsPopupVisible(false);
  }, [setIsPopupVisible]);

  const onFinishButtonClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push('/myaccount/profile');
    },
    [router],
  );

  const handleComplete = React.useCallback(() => {
    setIsPopupVisible(true);
  }, []);

  return (
    <Layout>
      <Head>
        <title>{t('Profile details')}</title>
      </Head>
      <MyAccountContainerLayout title={t('Profile details')} userApi={userApi}>
        <Link href="/myaccount/profile/request-otp">
          <IconTextLink icon={<ArrowBackIcon size="14px" />}>{t('Back')}</IconTextLink>
        </Link>
        <SubTitle textAlign="left">{t('Change your mobile')}</SubTitle>
        <InputOtpForm userApi={userApi} onComplete={handleComplete} requestOtpUrl={`/myaccount/profile/request-otp`} />
      </MyAccountContainerLayout>

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

MyAccountProfileInputOtpPage.displayName = 'MyAccountProfileInputOtpPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountProfileInputOtpPage);
