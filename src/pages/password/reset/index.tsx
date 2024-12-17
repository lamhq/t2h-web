import React, { useCallback } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Link from 'next/link';
import { withRouter, SingletonRouter } from 'next/router';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import InputText from '@components/molecules/InputText';
import { Title } from '@components/atoms/Title';
import { Button } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import { compose } from '@common/utils';
import { withAuth, withAuthServerSideProps, RedirectAction } from '@hocs/withAuth';
import { UserApi } from '@services/apis';
import { createApiClient } from '@services/core';
import { useForm } from 'react-hook-form';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import IconTextLink from '@components/molecules/IconTextLink';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';

interface PasswordResetPageProps extends WithTranslation {
  router: SingletonRouter;
}

const { publicRuntimeConfig } = getConfig();
const userApi = createApiClient(UserApi);

const PasswordResetPage: NextPage<PasswordResetPageProps> = (props: PasswordResetPageProps) => {
  const { t, router } = props;
  const { register, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const onSubmit = useCallback(
    async ({ email }) => {
      try {
        setGlobalSpinner(true);
        await userApi.recoverPassword({ email, recaptcha });
        await router.push('/password/reset/check');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, router, recaptcha, setGlobalSpinner],
  );

  const checkAvailability = useCallback(
    async (email: string) => {
      try {
        const result = await userApi.checkAvailability({ email });

        return !result['email'].check ? true : t('No account for this email');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });

        return true;
      }
    },
    [t, setGlobalSnackbar],
  );

  return (
    <Layout>
      <Container>
        <Link href="/signin">
          <IconTextLink icon={<ArrowBackIcon size="14px" />}>{t('Back to login')}</IconTextLink>
        </Link>
        <Flex alignItems="center" justifyContent="center">
          <Box width={{ _: 1, md: '340px' }}>
            <Title my={4}>{t('Did you forgot your password?')}</Title>
            <Text textAlign="center">{t('Not a problem! We’ll send you a link so you can reset your password.')}</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormControl>
                  <InputText
                    ref={register({
                      validate: checkAvailability,
                    })}
                    type="text"
                    label="Email"
                    name="email"
                    hasError={!!errors.email}
                    helperText={errors.email && t(errors.email.message.toString())}
                  />
                </FormControl>
              </FormGroup>
              <FormGroup>
                <FormControl>
                  <Button type="submit" variant="secondary">
                    {t('Reset password')}
                  </Button>
                </FormControl>
              </FormGroup>
            </form>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

PasswordResetPage.displayName = 'PasswordResetPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], PasswordResetPage);
