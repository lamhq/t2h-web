import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import getConfig from 'next/config';
import { withRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { withAuth, withAuthServerSideProps, RedirectAction, useAuthContext, AuthUser } from '@hocs/withAuth';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { createApiClient } from '@services/core';
import { AuthApi, UserApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import Box from '@components/layouts/Box';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import { Facebook, Line } from '@components/atoms/IconButton/icons';
import { CancelIcon, AddCircleOutlineIcon } from '@components/atoms/IconButton/buttons';
import SocialLinkButton from '@components/molecules/SocialLinkButton';
import InputText from '@components/molecules/InputText';
import { getPasswordStrongth, PasswordStrongth } from '@common/utils/validation';
import { SocialProviderType } from '@services/types';

const { publicRuntimeConfig } = getConfig();
const authApi = createApiClient(AuthApi);
const userApi = createApiClient(UserApi);

interface MyAccountSecurityPageProps extends WithTranslation {
  name: string;
  isFacebookConnected: boolean;
  isLineConnected: boolean;
}

const getSocialLinkButtonText = (providerName: SocialProviderType, isConnected: boolean) => {
  if (isConnected) {
    return 'Connected';
  }

  return `Connect ${providerName} account`;
};

interface FormData {
  currentPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}

const MyAccountSecurityPage: React.FC<MyAccountSecurityPageProps> = (props: MyAccountSecurityPageProps) => {
  const { t, isFacebookConnected, isLineConnected } = props;
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const me = useAuthContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const { register, handleSubmit, errors, watch, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
  });
  const [passwordStrongth, setPasswordStrongth] = React.useState(null);

  const onSubmit = React.useCallback(
    async (data: FormData) => {
      try {
        setGlobalSpinner(true);
        await authApi.signIn(me.username, data.currentPassword);
        await userApi.updateUser({ password: data.newPassword, recaptcha });
        setGlobalSnackbar({ message: t(`Password has been changed`), variant: 'success' });
        reset({ currentPassword: '', newPassword: '', repeatNewPassword: '' });
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, me, setGlobalSpinner, setGlobalSnackbar, reset, recaptcha],
  );

  const watchNewPassword = watch('newPassword');

  return (
    <Layout>
      <Head>
        <title>{t('Accounts & security')}</title>
      </Head>
      <MyAccountContainerLayout title={t('Accounts & security')} userApi={userApi}>
        <Title mt={0} mb={0} textAlign="left" color="text" fontSize="19px">
          {t(`Social media`)}
        </Title>
        <Text mt={3} mb={0} color="menuText" fontFamily="secondary">
          {t(`Connect your social media accounts to make it easier to sign in, connect and update your account.`)}
        </Text>

        <Box mt={5}>
          {isFacebookConnected ? (
            <SocialLinkButton
              href={`/myaccount/unlink?provider=facebook`}
              variant="facebook"
              leftIcon={<Facebook />}
              rightIcon={<CancelIcon color="white" size="20px" />}
              name={t(`Facebook`)}
              text={t(getSocialLinkButtonText(SocialProviderType.Facebook, isFacebookConnected))}
            />
          ) : (
            <SocialLinkButton
              href={`/api/auth/facebook?redirect_back=${encodeURI('/myaccount/security')}`}
              variant="facebook_outlined"
              leftIcon={<Facebook />}
              rightIcon={<AddCircleOutlineIcon color="facebook" size="20px" />}
              name={t(`Facebook`)}
              text={t(getSocialLinkButtonText(SocialProviderType.Facebook, isFacebookConnected))}
              textProps={{ color: 'facebook' }}
            />
          )}
        </Box>

        <Box mt={2}>
          {isLineConnected ? (
            <SocialLinkButton
              href={'/myaccount/unlink?provider=line'}
              variant="line"
              leftIcon={<Line />}
              rightIcon={<CancelIcon color="white" size="20px" />}
              name={t(`Line`)}
              text={t(getSocialLinkButtonText(SocialProviderType.Line, isLineConnected))}
            />
          ) : (
            <SocialLinkButton
              href={`/api/auth/line?redirect_back=${encodeURI('/myaccount/security')}`}
              variant="line_outlined"
              leftIcon={<Line />}
              rightIcon={<AddCircleOutlineIcon color="line" size="20px" />}
              name={t(`Line`)}
              text={t(getSocialLinkButtonText(SocialProviderType.Line, isLineConnected))}
              textProps={{ color: 'line' }}
            />
          )}
        </Box>

        <Title mt="40px" mb="18px" textAlign="left" color="text" fontSize="19px">
          {t(`Change password`)}
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormControl>
              <InputText
                ref={register({
                  required: { value: true, message: `${t(`Current password`)} ${t('is required')}` },
                })}
                type="password"
                name="currentPassword"
                label={t('Current Password')}
                hasError={!!errors.currentPassword}
                helperText={errors.currentPassword && `${t('Current Password')} ${t('is invalid')}`}
              />
            </FormControl>
          </FormGroup>
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
              <InputText
                ref={register({
                  required: { value: true, message: `${t(`Repeat password`)} ${t('is required')}` },
                  validate: (password) => password === watchNewPassword,
                })}
                type="password"
                name="repeatNewPassword"
                label={t('Repeat Password')}
                hasError={!!errors.repeatNewPassword}
                helperText={errors.repeatNewPassword && `${t('Repeat Password')} ${t('is invalid')}`}
              />
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <Button type="submit" variant="primary">
                {t('Change Password')}
              </Button>
            </FormControl>
          </FormGroup>
        </form>
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountSecurityPage.displayName = 'MyAccountSecurityPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(
  async (ctx, user?: AuthUser) => {
    const isFacebookConnected = (user?.authenticateProviders ?? []).some((p) => p.provider === SocialProviderType.Facebook);
    const isLineConnected = (user?.authenticateProviders ?? []).some((p) => p.provider === SocialProviderType.Line);

    return {
      props: {
        namespacesRequired: ['common'],
        isFacebookConnected,
        isLineConnected,
      },
    };
  },
);

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountSecurityPage);
