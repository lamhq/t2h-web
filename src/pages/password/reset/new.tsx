import React, { useState, useCallback } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { withRouter, SingletonRouter } from 'next/router';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
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
import { getPasswordStrongth, PasswordStrongth } from '@common/utils/validation';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';

interface PasswordResetNewPageProps extends WithTranslation {
  router: SingletonRouter;
}

const { publicRuntimeConfig } = getConfig();
const userApi = createApiClient(UserApi);

const PasswordResetNewPage: NextPage<PasswordResetNewPageProps> = (props: PasswordResetNewPageProps) => {
  const { t, router } = props;
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
    },
  });
  const [passwordStrongth, setPasswordStrongth] = useState(null);
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const recoveryToken = router.query['recovery_token'] || '';

  const onSubmit = useCallback(
    async (data) => {
      try {
        setGlobalSpinner(true);
        await userApi.resetPassword({ ...data, recoveryToken, recaptcha });
        await router.push('/password/reset/complete');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, router, recaptcha, recoveryToken, setGlobalSpinner],
  );

  return (
    <Layout>
      <Container>
        <Flex alignItems="center" justifyContent="center">
          <Box width={{ _: 1, md: '340px' }}>
            <Title>{t('Forgot Password')}</Title>
            <Text>{t('Enter your account email to reset your password')}</Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormControl>
                  <InputText
                    ref={register({
                      required: { value: true, message: `${t(`New Password`)} ${t('is required')}` },
                      validate: (password) => getPasswordStrongth(password) !== PasswordStrongth.Invalid,
                    })}
                    type="password"
                    name="newPassword"
                    label={t('New Password')}
                    hasError={!!errors.newPassword}
                    helperText={errors.newPassword && `${t('New Password')} ${t('is invalid')}`}
                    onChange={(password) => {
                      setPasswordStrongth(getPasswordStrongth(password.target.value));
                    }}
                  />
                  <Text my={1} variant="extraSmall" color="passwordStrongth" fontFamily="secondary">
                    {`${t(`Password strength`)}: ${passwordStrongth ?? ''}`}
                  </Text>
                  <Text my={1} variant="extraSmall" color="passwordRule" fontFamily="secondary">
                    {t(
                      `Password must be between 4 and 12 characters long. Password must contain letters (A-Z) and Numbers (0-9) and must not contain special symbols (*-_/#)`,
                    )}
                  </Text>
                </FormControl>
              </FormGroup>
              <FormGroup>
                <FormControl>
                  <Button type="submit" variant="primary">
                    {t('Reset Password')}
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

PasswordResetNewPage.displayName = 'PasswordResetNewPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], PasswordResetNewPage);
