import * as React from 'react';
import getConfig from 'next/config';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { SubTitle } from '@components/atoms/Title';
import Image from '@components/atoms/Image';
import SignupForm, { SignupFormData } from '@components/organisms/SignupForm';
import styled from 'styled-components';
import { Text } from '@components/atoms/Text';
import { compose, safeKey } from '@common/utils';
import { withAuth, RedirectAction, withAuthServerSideProps, useAuthContext } from '@hocs/withAuth';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import Stepper from '@components/molecules/Stepper';
import { FormBox } from '@components/layouts/FormBox';
import Box from '@components/layouts/Box';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';

interface SignupSocialLoginPageProps extends WithTranslation {
  router: SingletonRouter;
}

const StyledImage = styled(Image)`
  width: 120px;
  height: 120px;
  background-color: black;
  margin: 0 auto;
`;

const { publicRuntimeConfig } = getConfig();
const userApi = createApiClient(UserApi);

const SignupSocialLoginPage: NextPage<SignupSocialLoginPageProps> = (props: SignupSocialLoginPageProps) => {
  const { t, router } = props;
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const user = useAuthContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const greetingMessage = user ? `${t('Hi')} ${user.displayName}!` : `${t('Hi!')}`;
  const initialProps = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
  };

  const onSubmit = React.useCallback(
    async (formData: SignupFormData) => {
      try {
        setGlobalSpinner(true);
        if (formData.mobile !== undefined) formData.mobile = formData.mobile.replace(/\s/g, ``);

        await userApi.updateUser({ ...formData, recaptcha });
        await router.push('/signup/profile');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, router, setGlobalSpinner, recaptcha],
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
        <title>{t(`Your Profile`)}</title>
      </Head>
      <Stepper formName="" stepName="Create an account" currentStep={1} numOfSteps={2} />
      <Container>
        <FormBox mt="50px">
          <Box mx="auto" mt="-50px" width="120px" height="120px">
            <StyledImage src={user.profileImageUrl} shape="circle" />
          </Box>

          <Box mt={4}>
            <SubTitle my={0}>{greetingMessage}</SubTitle>
            <Text textAlign="center" my={2}>
              {t(`We’ve taken your details from facebook. Please confirm them below`)}
            </Text>
          </Box>

          <SignupForm {...initialProps} onSubmit={onSubmit} checkAvailability={checkAvailability} />
        </FormBox>
      </Container>
    </Layout>
  );
};

SignupSocialLoginPage.displayName = 'SignupSocialLoginPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SignupSocialLoginPage);
