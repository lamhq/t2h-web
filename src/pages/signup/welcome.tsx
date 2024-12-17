import React, { useCallback } from 'react';
import styled from 'styled-components';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { compose } from '@common/utils';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Flex from '@components/layouts/Flex';
import { Text, TextLabel, TextLink } from '@components/atoms/Text';
import { Title, SubTitle } from '@components/atoms/Title';
import Image from '@components/atoms/Image';
import Box from '@components/layouts/Box';
import { ButtonLink } from '@components/atoms/Button';
import EmailVerificaitionAlertMessage from '@containers/EmailVerificaitionAlertMessage';
import { withAuth, RedirectAction, withAuthServerSideProps, useAuthContext } from '@hocs/withAuth';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';

const ImageContainer = styled.div`
  width: 188px;
  height: 187px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f7;
  border-radius: 100%;
  margin: 24px auto;
`;

interface SignupWelcomePageProps extends WithTranslation {
  router: SingletonRouter;
}

const userApi = createApiClient(UserApi);

const SignupWelcomePage: NextPage<SignupWelcomePageProps> = ({ t }: SignupWelcomePageProps) => {
  const user = useAuthContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const handleResendEmailClick = useCallback(
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
        <title>{t(`Welcome`)}</title>
      </Head>
      {!user.isEmailVerified && <EmailVerificaitionAlertMessage userApi={userApi} />}
      <Container>
        <Flex alignItems="center" justifyContent="center">
          <Flex flexDirection={'column'} width={{ _: 1, md: '500px' }} alignItems="center" justifyContent="center">
            <Title>{t(`Welcome to Truck2Hand!`)}</Title>

            <ImageContainer>
              <Image width="110px" height="109px" src="/static/images/common/check-email.svg" />
            </ImageContainer>

            <SubTitle>{t(`Verify your account`)}</SubTitle>

            <TextLabel textAlign="center" fontFamily="secondary">
              {t(`Please click the activation link in the email we sent to you.`)}
            </TextLabel>

            <Box mt={3} mb={4}>
              <Text my={0} color="darkGrey" variant="small">
                {t(`Didn’t receive an email?`)}
                &nbsp;
                <TextLink color="link" onClick={handleResendEmailClick} variant="small">
                  {t(`Send again`)}
                </TextLink>
              </Text>
            </Box>

            <ButtonLink href="/" width="320px">
              Home
            </ButtonLink>
          </Flex>
        </Flex>
      </Container>
    </Layout>
  );
};

SignupWelcomePage.displayName = 'SignupWelcomePageProps';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SignupWelcomePage);
