import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import { Title } from '@components/atoms/Title';
import { ButtonLink } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import { withAuth, withAuthServerSideProps, RedirectAction } from '@hocs/withAuth';
import { compose } from '@common/utils';
import Flex from '@components/layouts/Flex';

interface PasswordResetCompletePageProps extends WithTranslation {
  router: SingletonRouter;
}

const PasswordResetCompletePage: NextPage<PasswordResetCompletePageProps> = (props: PasswordResetCompletePageProps) => {
  const { t } = props;

  return (
    <Layout>
      <Container>
        <Flex alignItems="center" justifyContent="center">
          <Box width={{ _: 1, md: '340px' }}>
            <Title>{t(`Your password has been successfully reset`)}</Title>
            <Text>{t('Enjoy Truck2Hand!!')}</Text>
            <Box mt={4}>
              <ButtonLink href="/signin" variant="primary">
                {t('Log in')}
              </ButtonLink>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

PasswordResetCompletePage.displayName = 'SignupIndexPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], PasswordResetCompletePage);
