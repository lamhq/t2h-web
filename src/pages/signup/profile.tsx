import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { Button } from '@components/atoms/Button';
import { SubTitle } from '@components/atoms/Title';
import { Text, TextLink } from '@components/atoms/Text';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import InputText from '@components/molecules/InputText';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import InputImage from '@components/molecules/InputImage';
import { compose, pickNotEmpty } from '@common/utils';
import { withAuth, withAuthServerSideProps, RedirectAction, useAuthContext } from '@hocs/withAuth';
import { useForm, Controller } from 'react-hook-form';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import Stepper from '@components/molecules/Stepper';
import { FormBox } from '@components/layouts/FormBox';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { isHomePhoneValid, isValidUrl } from '@common/utils/validation';

interface SignupProfilePageProps extends WithTranslation {
  router: SingletonRouter;
}

const { publicRuntimeConfig } = getConfig();
const userApi = createApiClient(UserApi);

const SignupProfilePage: NextPage<SignupProfilePageProps> = (props: SignupProfilePageProps) => {
  const { t, router } = props;
  const user = useAuthContext();
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const { register, handleSubmit, control, formState, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      profileImage: null,
      address: user.address,
      province: user.province,
      zipcode: user.zipcode,
      homePhone: user.homePhone,
      personalWebHomepage: user.personalWebHomepage,
    },
  });

  const onSubmit = React.useCallback(
    async (formData) => {
      try {
        setGlobalSpinner(true);
        const { profileImage, ...rest } = formData;

        if (profileImage && profileImage.file) {
          await userApi.uploadProfileImage(profileImage.file);
        }

        await userApi.updateUser({ ...pickNotEmpty(rest, true), recaptcha });
        await router.push('/signup/welcome');
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, router, setGlobalSpinner, recaptcha],
  );

  const sumitButtonVariant = formState.isValid ? 'primary' : 'disabled';

  return (
    <Layout>
      <Head>
        <title>{t('Your Profile')}</title>
      </Head>
      <Stepper stepName="Create an account" currentStep={2} numOfSteps={2} />
      <Container>
        <Flex alignItems="center" justifyContent="center">
          <Box width={{ _: 1, md: '500px' }}>
            <Flex alignItems="center">
              <Box ml="auto">
                <TextLink href="/signup/welcome" color="link" variant="small">
                  {t(`Skip step`)}
                </TextLink>
              </Box>
            </Flex>

            <FormBox mt="50px">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box mx="auto" mt="-50px" width="120px" height="120px">
                  <Controller
                    as={<InputImage name="profileImage" placeHolder={t('+Add photo')} />}
                    name="profileImage"
                    control={control}
                    onChange={(changes) => {
                      return changes.length > 0 ? changes[0] : undefined;
                    }}
                  />
                </Box>

                <Box mt={4}>
                  <SubTitle my={0}>{t('Welcome {{name}}', { name: user.displayName })}</SubTitle>
                  <Text textAlign="center" my={2}>
                    {t(`We’d like to get to know you better.`)}
                  </Text>
                </Box>

                <FormGroup>
                  <FormControl>
                    <InputText ref={register} type="text" label={t(`Address`)} name="address" />
                  </FormControl>
                  <FormControl>
                    <InputText ref={register} type="text" label={t(`Province`)} name="province" />
                  </FormControl>
                  <FormControl>
                    <Box width="136px">
                      <InputText ref={register} type="text" label={t(`ZIP code`)} name="zipcode" />
                    </Box>
                  </FormControl>
                  <FormControl>
                    <InputText
                      ref={register({
                        validate: async (homePhone) => {
                          if (homePhone && !isHomePhoneValid(homePhone)) {
                            return t('Please input correct format').toString();
                          }
                        },
                      })}
                      type="text"
                      label={t(`Home phone`)}
                      name="homePhone"
                      hasError={!!errors.homePhone}
                      helperText={errors.homePhone && t(errors.homePhone.message.toString())}
                    />
                  </FormControl>
                  <FormControl>
                    <InputText
                      ref={register({
                        validate: async (personalWebHomepage) => {
                          if (personalWebHomepage && !isValidUrl(personalWebHomepage)) {
                            return t('Please input correct format').toString();
                          }
                        },
                      })}
                      type="text"
                      label={t(`Homepage URL`)}
                      name="personalWebHomepage"
                      hasError={!!errors.personalWebHomepage}
                      helperText={errors.personalWebHomepage && t(errors.personalWebHomepage.message.toString())}
                    />
                  </FormControl>
                </FormGroup>

                <FormGroup>
                  <Button variant={sumitButtonVariant} type="submit" disabled={!formState.isValid}>
                    {t('Create account')}
                  </Button>
                </FormGroup>
              </form>
            </FormBox>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

SignupProfilePage.displayName = 'SignupProfilePage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SignupProfilePage);
