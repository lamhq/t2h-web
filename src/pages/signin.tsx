import React, { useCallback } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import Layout from '@containers/Layout';
import LoginForm from '@components/molecules/LoginForm';
import Container from '@components/layouts/Container';
import Separator from '@components/atoms/Separator';
import { Title } from '@components/atoms/Title';
import { ButtonLink } from '@components/atoms/Button';
import SocialLoginButtonList from '@components/molecules/SocialLoginButtonList';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { compose } from '@common/utils';
import { createApiClient } from '@services/core';
import { AuthApi } from '@services/apis';
import { FormBox } from '@components/layouts/FormBox';
import { SubTitle } from '@components/atoms/Title';
import { AppLogo } from '@components/atoms/AppLogo';
import Flex from '@components/layouts/Flex';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import Box from '@components/layouts/Box';
import styled from 'styled-components';

const SvgWrapper = styled.div`
  @media screen and (min-width: ${({ theme }) => theme.breakpoints['md']}) {
    svg {
      width: 263px;
      height: 75px;
    }
  }
`;

interface SigninPageProps extends WithTranslation {
  router: SingletonRouter;
}

const authApi = createApiClient(AuthApi);

const SigninPage: NextPage<SigninPageProps> = (props: SigninPageProps) => {
  const { t, router } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const handleSubmit = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      try {
        setGlobalSpinner(true);
        await authApi.signIn(username, password);
        await router.push('/');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, router, setGlobalSnackbar, setGlobalSpinner],
  );

  return (
    <Layout>
      <Head>
        <title>{t('Log in')}</title>
      </Head>
      <Container>
        <Flex
          flexDirection={{ _: 'column', md: 'row' }}
          mt={{ _: 0, md: 4 }}
          mb={{ _: 2, md: 4 }}
          alignItems="center"
          justifyContent="center"
        >
          <Title mb={{ _: 2, md: 4 }}>{t('Get the most from')}</Title>
          <SvgWrapper>
            <AppLogo width={193} height={58} />
          </SvgWrapper>
        </Flex>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center">
          <Box width={{ _: 1, md: '468px' }} mr={{ _: 0, md: 5 }} mb={{ _: 4, md: 0 }}>
            <FormBox>
              <LoginForm passwordResetUrl={'/password/reset'} onSubmit={handleSubmit} />
            </FormBox>
          </Box>
          <Box width={{ _: 1, md: '468px' }}>
            <FormBox>
              <SubTitle mt={0}>{t('Join us')}</SubTitle>
              <ButtonLink href="/signup" variant="contact">
                {t('Register')}
              </ButtonLink>
              <Separator height="52px">{t('or')}</Separator>
              <SocialLoginButtonList
                facebookAuthUrl={`/api/auth/facebook?redirect_back=${encodeURIComponent('/')}`}
                lineAuthUrl={`/api/auth/line?redirect_back=${encodeURIComponent('/')}`}
              />
            </FormBox>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

SigninPage.displayName = 'SigninPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SigninPage);
