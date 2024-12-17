import * as React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import { WithTranslation } from 'react-i18next';
import Layout from '@containers/Layout';
import { withTranslation } from '@server/i18n';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { Title } from '@components/atoms/Title';
import Container from '@components/layouts/Container';
import { compose } from '@common/utils';

interface AccountPageProps extends WithTranslation {
  router: SingletonRouter;
}

const AccountPage: NextPage<AccountPageProps> = (props: AccountPageProps) => {
  const { t } = props;

  return (
    <Layout>
      <Container>
        <Title>{t('My account')}</Title>
      </Container>
    </Layout>
  );
};

AccountPage.displayName = 'AccountPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], AccountPage);
