import * as React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import MyAccount from '@components/organisms/MyAccount';
import { withAuth, RedirectAction, withAuthServerSideProps, useAuthContext } from '@hocs/withAuth';
import { compose } from '@common/utils';
import EmailAlertMessage from '@components/molecules/EmailAlertMessage';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { UserApi } from '@services/apis';
import { createApiClient } from '@services/core';

interface MyAccountIndxPageProps extends WithTranslation {
  router: SingletonRouter;
}

const userApi = createApiClient(UserApi);

const MyAccountIndxPage: NextPage<MyAccountIndxPageProps> = (props: MyAccountIndxPageProps) => {
  const { t } = props;
  const user = useAuthContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const handleResendEmailClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        setGlobalSpinner(true);
        await userApi.sendVerificaitionEmail();
        setGlobalSnackbar({ message: t("We've sent you a verification email"), variant: 'success' });
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, setGlobalSpinner],
  );

  return (
    <Layout>
      <Head>
        <title>{t(`MyAccount`)}</title>
      </Head>
      {!user.isEmailVerified && <EmailAlertMessage onResendEmailClick={handleResendEmailClick} />}
      <Container>
        <MyAccount user={user} />
      </Container>
    </Layout>
  );
};

MyAccountIndxPage.displayName = 'MyAccountIndxPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountIndxPage);
