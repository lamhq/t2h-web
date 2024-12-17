import * as React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import getConfig from 'next/config';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { Title, SubTitle } from '@components/atoms/Title';
import { TextLink } from '@components/atoms/Text';
import SocialLoginButtonList from '@components/molecules/SocialLoginButtonList';
import Flex from '@components/layouts/Flex';
import SignupForm, { SignupFormData } from '@components/organisms/SignupForm';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { compose, safeKey } from '@common/utils';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { createApiClient } from '@services/core';
import { UserApi, AuthApi } from '@services/apis';
import { FormBox } from '@components/layouts/FormBox';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import Box from '@components/layouts/Box';
import Stepper from '@components/molecules/Stepper';

interface SignupIndexPageProps extends WithTranslation {
  router: SingletonRouter;
}

const { publicRuntimeConfig } = getConfig();
const userApi = createApiClient(UserApi);
const authApi = createApiClient(AuthApi);

const SignupIndexPage: NextPage<SignupIndexPageProps> = (props: SignupIndexPageProps) => {
  const { t, router } = props;
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const onSubmit = React.useCallback(
    async (formData: SignupFormData) => {
      try {
        const { mobile, ...rest } = formData;

        setGlobalSpinner(true);
        await userApi.createUser({ ...rest, ...{ mobile: mobile.replace(/ /g, '') }, recaptcha });
        await authApi.signIn(formData.username, formData.password);
        await router.push('/signup/profile');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, recaptcha, router, setGlobalSpinner],
  );

  const checkAvailability = React.useCallback(
    async (key: string, value: string) => {
      const data = {};

      data[safeKey(key)] = value;
      const result = await userApi.checkAvailability(data);

      if (!result[safeKey(key)].check) return t(result[safeKey(key)].message);

      return true;
    },
    [t],
  );

  return (
    <Layout>
      <Head>
        <title>{t(`Join us today`)}</title>
      </Head>
      <Stepper stepName="Create an account" currentStep={1} numOfSteps={2} />
      <Container>
        <Flex alignItems="center" justifyContent="center">
          <Box width={{ _: 1, md: '500px' }}>
            <Title mt="8px" mb={24}>
              {t(`Join us today`)}
            </Title>
            <SocialLoginButtonList facebookAuthUrl={'/api/auth/facebook'} lineAuthUrl={'/api/auth/line'} />
            <Flex my={3} justifyContent="center">
              <TextLink href="/signin" variant="small" color="link">
                {t(`Already have an account? Sign in`)}
              </TextLink>
            </Flex>
            <FormBox>
              <SubTitle mt={0}>{t(`Sign up`)}</SubTitle>
              <SignupForm onSubmit={onSubmit} checkAvailability={checkAvailability} />
            </FormBox>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

SignupIndexPage.displayName = 'SignupIndexPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SignupIndexPage);
