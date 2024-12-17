import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import getConfig from 'next/config';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { withAuth, withAuthServerSideProps, RedirectAction, useAuthContext, AuthUser } from '@hocs/withAuth';
import { compose } from '@common/utils';
import { createApiClient } from '@services/core';
import { UserApi, AuthenticateProviderApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import Box from '@components/layouts/Box';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Text } from '@components/atoms/Text';
import { Button } from '@components/atoms/Button';
import IconTextLink from '@components/molecules/IconTextLink';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import { Title } from '@components/atoms/Title';
import { Facebook, Line } from '@components/atoms/IconButton/icons';
import SocialLinkButton from '@components/molecules/SocialLinkButton';
import InputText from '@components/molecules/InputText';
import { getPasswordStrongth, PasswordStrongth } from '@common/utils/validation';
import { SocialProviderType } from '@services/types';

const { publicRuntimeConfig } = getConfig();
const userApi = createApiClient(UserApi);
const authenticateProviderApi = createApiClient(AuthenticateProviderApi);

const getSocialServiceName = (providerType: SocialProviderType) => {
  if (providerType === SocialProviderType.Facebook) {
    return 'Facebook';
  } else if (providerType === SocialProviderType.Line) {
    return 'Line';
  }
};

const SocialButtonLeftIcon = ({ provider }: { provider: SocialProviderType }) => {
  if (provider === SocialProviderType.Facebook) {
    return <Facebook />;
  } else if (provider === SocialProviderType.Line) {
    return <Line />;
  }

  return null;
};

interface FormData {
  password: string;
  repeatPassword: string;
}

interface MyAccountUnlinkSocialPageProps extends WithTranslation {
  router: SingletonRouter;
  provider: SocialProviderType;
}

const MyAccountUnlinkSocialPage: React.FC<MyAccountUnlinkSocialPageProps> = (props: MyAccountUnlinkSocialPageProps) => {
  const { t, router, provider } = props;
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const me = useAuthContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const { register, handleSubmit, errors, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
  });
  const [passwordStrongth, setPasswordStrongth] = React.useState(null);
  const watchPassword = watch('password');

  const onSubmit = React.useCallback(
    async (data: FormData) => {
      try {
        setGlobalSpinner(true);
        if (me.hasPassword !== true) {
          await userApi.updateUser({ password: data.password, recaptcha });
        }

        await authenticateProviderApi.disconnectSocialAccount(provider);
        router.push('/myaccount/security');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, router, me, provider, setGlobalSpinner, setGlobalSnackbar, recaptcha],
  );

  const title = `Unlink ${getSocialServiceName(provider)} account`;

  return (
    <Layout>
      <Head>
        <title>{t('Accounts & security')}</title>
      </Head>
      <MyAccountContainerLayout title={t('Accounts & security')} userApi={userApi}>
        <Link href="/myaccount/security">
          <IconTextLink icon={<ArrowBackIcon size="14px" />}>{t('Back to login')}</IconTextLink>
        </Link>
        <Title mt={3} mb={0} fontSize="23px" color="#333" textAlign="left">
          {t(title)}
        </Title>
        <Box mt="21px">
          <SocialLinkButton
            variant={provider}
            leftIcon={<SocialButtonLeftIcon provider={provider} />}
            name={t(`Facebook`)}
            text={t('Connected')}
          />
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {me.hasPassword !== true && (
            <React.Fragment>
              <Text mt={3} mb={0} color="darkGrey" variant="small" fontFamily="secondary">
                {t(`Before you can unlink your ${getSocialServiceName(provider)} account, you must set a password.`)}
              </Text>

              <Text mt={3} mb={0} color="darkGrey" variant="small" fontFamily="secondary">
                {t(`You will use your password to continue to log in to your account.`)}
              </Text>

              <FormGroup>
                <FormControl>
                  <InputText
                    ref={register({
                      required: { value: true, message: `${t(`Password`)} ${t('is required')}` },
                      validate: (password) => getPasswordStrongth(password) !== PasswordStrongth.Invalid,
                    })}
                    type="password"
                    name="password"
                    label={t('Password')}
                    hasError={!!errors.password}
                    helperText={errors.password && `${t('Password')} ${t('is invalid')}`}
                    onChange={(password) => {
                      setPasswordStrongth(getPasswordStrongth(password.target.value));
                    }}
                  />
                  <Text my={1} variant="extraSmall" color="passwordStrongth" fontFamily="secondary">
                    {`${t(`Password strength`)}: ${passwordStrongth ?? ''}`}
                  </Text>
                  <Text my={1} color="red" variant="extraSmall" fontFamily="secondary">
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
                      required: { value: true, message: `${t(`Repeat passowrd`)} ${t('is required')}` },
                      validate: (password) => password === watchPassword,
                    })}
                    type="password"
                    name="repeatPassword"
                    label={t('Repeat Password')}
                    hasError={!!errors.repeatPassword}
                    helperText={errors.repeatPassword && `${t('Repeat Password')} ${t('is invalid')}`}
                  />
                </FormControl>
              </FormGroup>
            </React.Fragment>
          )}
          <Box mt={5}>
            <Button type="submit" variant="primary">
              {t(`Unlink ${getSocialServiceName(provider)}`)}
            </Button>
          </Box>
        </form>
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountUnlinkSocialPage.displayName = 'MyAccountUnlinkSocialPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.None)(async (ctx, user?: AuthUser) => {
  const provider = Array.isArray(ctx.query.provider) ? ctx.query.provider.toString() : ctx.query.provider;
  const availableProviders: string[] = [SocialProviderType.Facebook, SocialProviderType.Line];

  if (!availableProviders.some((p) => p === provider)) {
    ctx.res.writeHead(301, { Location: '/myaccount/security', 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' });
    ctx.res.end();
  }

  if (!(user?.authenticateProviders ?? []).some((p) => p.provider === provider)) {
    ctx.res.writeHead(301, { Location: '/myaccount/security', 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' });
    ctx.res.end();
  }

  return {
    props: {
      namespacesRequired: ['common'],
      provider,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountUnlinkSocialPage);
