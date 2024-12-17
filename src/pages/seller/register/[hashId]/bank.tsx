import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import Link from 'next/link';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import { useForm, Controller } from 'react-hook-form';
import { createApiClient } from '@services/core';
import { SellerApplicationApi, FileApi } from '@services/apis';
import { FileCategory, FilePermission, SellerApplicationResponse, BankArrayResponse } from '@services/types';
import { getSellerApplication } from '@services/facades/seller-application';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Button } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import Image from '@components/atoms/Image';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';
import InputText from '@components/molecules/InputText';
import { HelpOutlineIcon } from '@components/atoms/IconButton';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import FormOutline from '@components/molecules/FormOutline';
import Dropdown from '@components/molecules/Dropdown';
import { ImageData } from '@components/molecules/InputImages';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import FormHelper from '@components/molecules/FormHelper';
import { uploadImageIfNotUploaded } from '@services/facades/file';
import InputImageController from '@components/organisms/InputImageController';
import { isAjax } from '@common/server';
import { isChrome } from '@common/utils/browser';
import { getBankMaster } from '@services/facades/bank-master';

const sellerApplicationApi = createApiClient(SellerApplicationApi);
const fileApi = createApiClient(FileApi);

interface FormValues {
  bankHashId: string;
  bankAccNo: string;
  bankBookImageFile: ImageData;
}

interface SellerRegisterBankInputProps extends WithTranslation {
  router: SingletonRouter;
  application?: SellerApplicationResponse;
  banks: BankArrayResponse;
}

const getDefaultFormValuesByApplication = (application: SellerApplicationResponse) => {
  const defaultBankBookImageFile: ImageData | null = application?.bankBookFile
    ? { src: application.bankBookFile.url, hashId: application.bankBookFile.hashId }
    : null;

  return {
    bankHashId: application?.bankHashId,
    bankAccNo: application?.bankAccNo,
    bankBookImageFile: defaultBankBookImageFile,
  };
};

const SellerRegisterBankInput: NextPage<SellerRegisterBankInputProps> = (props: SellerRegisterBankInputProps) => {
  const { router, t, application, banks } = props;
  const defaultValues = getDefaultFormValuesByApplication(application);
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  // TODO: replace logo icon
  const banksOptions = banks.map((b) => ({ value: b.hashId, label: `${b.thaiName} / ${b.englishName}`, logo: '/static/images/1.jpg' }));

  const { register, reset, handleSubmit, formState, control, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
  });

  const onSubmit = React.useCallback(
    async (data: FormValues) => {
      setGlobalSpinner(true);
      let newBankBookFile: ImageData = null;

      try {
        newBankBookFile = await uploadImageIfNotUploaded(fileApi, data.bankBookImageFile, {
          category: FileCategory.SellerApp,
          permission: FilePermission.Private,
        });

        await sellerApplicationApi.updateApplication(application.hashId, {
          bankHashId: data.bankHashId,
          bankAccNo: data.bankAccNo,
          bankBookFileHashId: newBankBookFile.hashId,
        });

        router.push(`/seller/register/[hashId]/submit`, `/seller/register/${encodeURIComponent(application.hashId)}/submit`);
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        reset({
          ...data,
          bankBookImageFile: newBankBookFile,
        });

        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, router, reset, setGlobalSpinner, application],
  );

  const bankLogoRenderer = React.useCallback(({ logo }) => <Image width="30px" height="30px" src={logo} shape="circle" />, []);
  // TODO: Make submit button enabled and disabled depending on form input
  // const buttonPrimary = formState.isValid ? 'primary' : 'disabled'

  return (
    <Layout>
      <Head>
        <title>{t('Seller Registration')}</title>
      </Head>

      <FormHeaderContainer>
        <Box width={{ _: 1, md: '720px' }} mx={{ _: 0, md: 'auto' }}>
          <ResponsiveStepper
            currentStep={1}
            title={t(`Seller registration`)}
            steps={[t('Personal details'), t('Bank details'), t('Submit application')]}
          />
        </Box>
      </FormHeaderContainer>

      <Container width={{ md: '968px' }} mx="auto">
        <Link href={`/seller/register/personal?hashId=${application.hashId}`}>
          <Flex alignItems="center" mb="15px">
            <ArrowBackIcon size="16px" color="text" />
            <Text my={0} ml="10px" variant="small" fontFamily="secondary">
              {t(`Back to personal details`)}
            </Text>
          </Flex>
        </Link>

        <Box mt={{ _: '15px', md: '45px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <ResponsiveFormItem>
                <FormOutline
                  outline={`${t(`Bank details`)} *`}
                  icon={<HelpOutlineIcon tooltip="Please use your own personal bank account details." size="16px" color="helpIcon" />}
                />
                <FormControl mt={3}>
                  <Text my={0} variant="small">
                    {t(`Select your bank`)}
                  </Text>
                  <Controller
                    as={
                      <Dropdown
                        options={banksOptions}
                        height="66px"
                        defaultValue={getValues('bankHashId')}
                        isLeftIconVisible={true}
                        leftIconRenderer={bankLogoRenderer}
                      />
                    }
                    name="bankHashId"
                    control={control}
                    onChange={(changes) => changes[0]?.value}
                  />
                </FormControl>
                <FormControl mt={3}>
                  <InputText ref={register} type="text" label={`${t(`Bank account number`)} *`} name="bankAccNo" />
                </FormControl>
              </ResponsiveFormItem>
            </FormGroup>

            <FormGroup>
              <ResponsiveFormContainer>
                <ResponsiveFormItem>
                  <FormOutline outline={`${t(`Photo of your bank book`)} *`} />
                  <FormControl mt={3}>
                    <Controller
                      as={
                        <InputImageController
                          defaultImages={getValues('bankBookImageFile') ? [getValues('bankBookImageFile')] : []}
                          maximumNumber={1}
                        />
                      }
                      name="bankBookImageFile"
                      control={control}
                      onChange={(changes) => {
                        return changes.length > 0 ? changes[0][0] : undefined;
                      }}
                    />
                  </FormControl>
                </ResponsiveFormItem>
                <ResponsiveFormDescription>
                  {/* TODO: open dialog for mobile */}
                  <FormHelper
                    description={t(`Please take a clear making sure to avoid blury images and reflections.`)}
                    linkText={t(`See example`)}
                    linkUrl="/static/images/seller/register/company-certificate-sample.png"
                    imageUrl="/static/images/seller/register/company-certificate-sample.png"
                  />
                </ResponsiveFormDescription>
              </ResponsiveFormContainer>
            </FormGroup>

            <FormGroup mt="40px" mb="42px">
              <Box width={{ _: 1, md: '246px' }} ml={{ _: 0, md: 'auto' }}>
                <Button variant={formState.isValid ? 'primary' : 'disabled'} type="submit">
                  {t(`Next`)}
                </Button>
              </Box>
            </FormGroup>
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

SellerRegisterBankInput.displayName = 'SellerRegisterBankInput';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const application = await getSellerApplication(ctx);
    const banks = await getBankMaster(ctx);

    if (!application) {
      const redirect = '/seller/register';

      // Redirect if request is not ajax or the browser is chrome
      if (!isAjax(ctx.req) || isChrome(ctx.req.headers['user-agent'])) {
        ctx.res.writeHead(301, { Location: redirect, 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' });
        ctx.res.end();
      }

      return {
        props: { error: { message: 'You are not allowed to access this page', statusCode: 301, redirect } },
      };
    }

    return {
      props: {
        namespacesRequired: ['common'],
        application,
        banks,
      },
    };
  } catch (err) {
    const statusCode = err.statusCode || 500;

    ctx.res.statusCode = statusCode;

    return {
      props: { error: { message: err.message, statusCode } },
    };
  }
});

export default compose([withAuth, withRouter, withTranslation('common')], SellerRegisterBankInput);
