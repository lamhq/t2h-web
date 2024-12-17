import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose, pickNotEmpty } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import { useForm, Controller } from 'react-hook-form';
import { createApiClient } from '@services/core';
import { SellerApplicationApi, FileApi, ProvinceMasterApi } from '@services/apis';
import { FileCategory, FilePermission, ApplicationType, SellerApplicationResponse, CreateSellerApplicationRequest } from '@services/types';
import { getSellerApplication, getMyLatestSellerApplication } from '@services/facades/seller-application';
import { uploadImageIfNotUploaded } from '@services/facades/file';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import { FormGroup } from '@components/layouts/FormGroup';
import { Title } from '@components/atoms/Title';
import { Button } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';
import SellerTypeCard from '@components/organisms/SellerTypeCard';
import RadioGroup, { RadioGroupProps } from '@components/molecules/RadioGroup';
import { ImageData } from '@components/molecules/InputImages';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import { CompanyFormGroup, IdentificationFormGroup, SelfieFormGroup, AddressFormGroup } from '@containers/SellerRegistrationFormGroup';
import { DEDUCTING_WITHHOLDING_TAX_OPTIONS } from '@constants/formdata';

const sellerApplicationApi = createApiClient(SellerApplicationApi);
const fileApi = createApiClient(FileApi);
const provinceApi = createApiClient(ProvinceMasterApi);

interface FormValues {
  type: ApplicationType;
  nationalId: string;
  passportNo: string;
  companyName: string;
  bankHashId?: string;
  bankAccNo: string;
  bankBookFileHashId?: string;
  companyTaxId: string;
  idCardType: string;
  deductTaxType: string;
  idImageFile?: ImageData;
  selfieImageFile?: ImageData;
  dbdImageFile?: ImageData;
  porpor20ImageFile?: ImageData;
  homeRegistrationDocImageFile?: ImageData;
  provinceHashId?: string;
  address?: string;
  sellerType?: string;
}

const checkIfImagesUploaded = (data: FormValues) => {
  if (!data.idImageFile) {
    throw new Error('Photo of your ID Card is not uploaded');
  }

  if (!data.selfieImageFile) {
    throw new Error('Selfie is not uploaded');
  }

  if (data.type === ApplicationType.Corporation) {
    if (!data.dbdImageFile) {
      throw new Error('Photo of DBD is not uploaded');
    }

    if (data.deductTaxType === DEDUCTING_WITHHOLDING_TAX_OPTIONS[0].value && !data.porpor20ImageFile) {
      throw new Error('Photo of Porpor20 is not uploaded');
    }
  }
};

// eslint-disable-next-line complexity
const getDefaultFormValuesByApplication = (application?: SellerApplicationResponse): FormValues => {
  let defaultIdCardType = null;

  if (application?.nationalId) {
    defaultIdCardType = 'nationalId';
  } else if (application?.passportNo) {
    defaultIdCardType = 'passport';
  }

  let defaultDeductTaxType = null;

  if (application?.porpor20File) {
    defaultDeductTaxType = DEDUCTING_WITHHOLDING_TAX_OPTIONS[0].value;
  } else {
    defaultDeductTaxType = DEDUCTING_WITHHOLDING_TAX_OPTIONS[1].value;
  }

  const defaultIdImageFile: ImageData | null = application?.nationalIdCardFile
    ? { src: application.nationalIdCardFile.url, hashId: application.nationalIdCardFile.hashId }
    : null;
  const defaultSelfieImageFile: ImageData | null = application?.selfieFile
    ? { src: application.selfieFile.url, hashId: application.selfieFile.hashId }
    : null;
  const defaultDbdImageFile: ImageData | null = application?.dbdFile
    ? { src: application.dbdFile.url, hashId: application.dbdFile.hashId }
    : null;
  const defaultPorpor20ImageFile: ImageData | null = application?.porpor20File
    ? { src: application.porpor20File.url, hashId: application.porpor20File.hashId }
    : null;
  const defaultHomeRegistrationDocFile: ImageData | null = application?.homeRegistrationDocFile
    ? { src: application.homeRegistrationDocFile.url, hashId: application.homeRegistrationDocFile.hashId }
    : null;

  return {
    type: application?.type,
    nationalId: application?.nationalId,
    passportNo: application?.passportNo,
    companyName: application?.companyName,
    companyTaxId: application?.companyTaxId,
    idCardType: defaultIdCardType,
    deductTaxType: defaultDeductTaxType,
    idImageFile: defaultIdImageFile,
    selfieImageFile: defaultSelfieImageFile,
    dbdImageFile: defaultDbdImageFile,
    porpor20ImageFile: defaultPorpor20ImageFile,
    provinceHashId: application?.province?.hashId,
    address: application?.address,
    homeRegistrationDocImageFile: defaultHomeRegistrationDocFile,
    bankHashId: application?.bankHashId,
    bankAccNo: application?.bankAccNo,
    bankBookFileHashId: application?.bankBookFile?.hashId,
    sellerType: application?.sellerType,
  };
};

const uploadImagesIfNotUploaded = async (data: FormValues) => {
  const query = {
    category: FileCategory.SellerApp,
    permission: FilePermission.Private,
  };

  let newImagePromises = [
    uploadImageIfNotUploaded(fileApi, data.idImageFile, query),
    uploadImageIfNotUploaded(fileApi, data.selfieImageFile, query),
  ];

  if (data['type'] === ApplicationType.Corporation) {
    newImagePromises.push(uploadImageIfNotUploaded(fileApi, data.dbdImageFile, query));
    if (data['deductTaxType'] === DEDUCTING_WITHHOLDING_TAX_OPTIONS[0].value) {
      newImagePromises.push(uploadImageIfNotUploaded(fileApi, data.porpor20ImageFile, query));
    } else {
      newImagePromises.push(null);
    }
  } else {
    newImagePromises = newImagePromises.concat([null, null]);
  }

  if (data.homeRegistrationDocImageFile) {
    newImagePromises.push(uploadImageIfNotUploaded(fileApi, data.homeRegistrationDocImageFile, query));
  } else {
    newImagePromises.push(null);
  }

  return Promise.all(newImagePromises);
};

const createApplicationRequest = (
  data: FormValues,
  idImage: ImageData | null,
  selfieImage: ImageData | null,
  dbdImage: ImageData | null,
  porpor20Image: ImageData | null,
  homeRegistrationFile: ImageData | null,
): Partial<CreateSellerApplicationRequest> => {
  let nationalId, passportNo;
  const nationalIdCardFileHashId = idImage?.hashId;
  const selfieFileHashId = selfieImage?.hashId;
  const dbdFileHashId = dbdImage?.hashId;
  const porpor20FileHashId = porpor20Image?.hashId;
  const homeRegistrationDocFileHashId = homeRegistrationFile?.hashId;

  switch (data.idCardType) {
    case 'nationalId':
      nationalId = data.nationalId.replace(/ /g, '');
      passportNo = '';
      break;
    case 'passport':
      nationalId = '';
      passportNo = data.passportNo;
      break;
    default:
      throw new Error(`Invalud Card Type: ${data.idCardType}`);
  }

  return pickNotEmpty(
    {
      type: data.type,
      nationalId,
      passportNo,
      companyName: data.companyName,
      companyTaxId: data.companyTaxId,
      nationalIdCardFileHashId,
      selfieFileHashId,
      dbdFileHashId,
      porpor20FileHashId,
      homeRegistrationDocFileHashId,
      address: data.address,
      provinceHashId: data.provinceHashId,
      bankBookFileHashId: data.bankBookFileHashId,
      bankHashId: data.bankHashId,
      bankAccNo: data.bankAccNo,
      sellerType: data.sellerType,
    },
    true,
  );
};

const SellingTypeRadioGroup = (props: RadioGroupProps) => (
  <RadioGroup justifyContent="center" {...props}>
    <Box width={{ _: '', md: '245px' }}>
      <SellerTypeCard
        imageSrc="/static/images/seller/register/individual.svg"
        title="Individual"
        description="Selling personal vehicles that belong to you."
        value={ApplicationType.Individual}
      />
    </Box>
    <Box ml={3} width={{ _: '', md: '245px' }}>
      <SellerTypeCard
        imageSrc="/static/images/seller/register/company.svg"
        title="Company"
        description="Selling personal vehicles that belong to you."
        value={ApplicationType.Corporation}
      />
    </Box>
  </RadioGroup>
);

interface SellerRegisterPersonalInputProps extends WithTranslation {
  router: SingletonRouter;
  application?: SellerApplicationResponse;
}

// eslint-disable-next-line complexity
const SellerRegisterPersonalInput: NextPage<SellerRegisterPersonalInputProps> = (props: SellerRegisterPersonalInputProps) => {
  const { t, router, application } = props;
  const applicationId = router.query.hashId as string;
  const defaultValues = getDefaultFormValuesByApplication(application);
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const { register, watch, handleSubmit, errors, getValues, reset, control, formState } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
  });

  const onSubmit = React.useCallback(
    async (data: FormValues) => {
      let newIdImage: ImageData | null = null;
      let newSelfieImage: ImageData | null = null;
      let newDbdImage: ImageData | null = null;
      let newPorpor20Image: ImageData | null = null;
      let newHomeRegistrationDocImage: ImageData | null = null;

      try {
        checkIfImagesUploaded(data);
        setGlobalSpinner(true);

        [newIdImage, newSelfieImage, newDbdImage, newPorpor20Image, newHomeRegistrationDocImage] = await uploadImagesIfNotUploaded(data);

        const request = createApplicationRequest(
          data,
          newIdImage,
          newSelfieImage,
          newDbdImage,
          newPorpor20Image,
          newHomeRegistrationDocImage,
        );

        if (applicationId) {
          sellerApplicationApi.updateApplication(application.hashId, request);
          router.push(`/seller/register/[hashId]/bank`, `/seller/register/${encodeURIComponent(applicationId)}/bank`);
        } else {
          const res = await sellerApplicationApi.createApplication(request);

          router.push(`/seller/register/[hashId]/bank`, `/seller/register/${encodeURIComponent(res.hashId)}/bank`);
        }
      } catch (error) {
        console.log(error);
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
        reset({
          ...data,
          idImageFile: newIdImage,
          selfieImageFile: newSelfieImage,
          dbdImageFile: newDbdImage,
          porpor20ImageFile: newPorpor20Image,
          homeRegistrationDocImageFile: newHomeRegistrationDocImage,
        });
      }
    },
    [t, router, reset, setGlobalSpinner, setGlobalSnackbar, application, applicationId],
  );

  const idCardType = watch('idCardType');
  const deductTaxType = watch('deductTaxType');
  const watchApplicationType = watch('type');

  return (
    <Layout>
      <Head>
        <title>{t('Seller Registration')}</title>
      </Head>
      <FormHeaderContainer>
        <Box width={{ _: 1, md: '720px' }}>
          <ResponsiveStepper
            currentStep={0}
            title={t(`Seller registration`)}
            steps={[t('Personal details'), t('Bank details'), t('Submit application')]}
          />
        </Box>
      </FormHeaderContainer>

      <Container width={{ md: '968px' }} mx="auto">
        <Title
          mt={0}
          mb={0}
          textAlign="center"
          fontSize={{ _: 5, md: 6 }}
          lineHeight={{ _: '27px', md: 5 }}
          letterSpacing="0.1px"
          color="text"
          fontWeight="bold"
        >
          {t(`Lets get started`)}
        </Title>
        <Text
          mt={{ _: 2, md: '5px' }}
          mb={0}
          textAlign="center"
          fontSize={{ _: 2, md: 3 }}
          letterSpacing={{ _: 2, md: 3 }}
          lineHeight={{ _: 2, md: 3 }}
        >
          {t(`Please select your registration type`)}
        </Text>

        <Box mt="24px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller as={SellingTypeRadioGroup} name="type" control={control} defaultValue={getValues('type')} />
            <Box mt={{ _: 5, md: '68px' }}>
              {watchApplicationType === ApplicationType.Corporation && (
                <CompanyFormGroup ref={register} control={control} getValues={getValues} errors={errors} deductTaxType={deductTaxType} />
              )}
              <IdentificationFormGroup ref={register} control={control} getValues={getValues} errors={errors} idCardType={idCardType} />
              <SelfieFormGroup control={control} getValues={getValues} />
              <AddressFormGroup ref={register} provinceApi={provinceApi} control={control} getValues={getValues} errors={errors} />
              {/* hidden data */}
              <input ref={register} name="bankBookFileHashId" type="hidden" />
              <input ref={register} name="bankHashId" type="hidden" />
              <input ref={register} name="bankAccNo" type="hidden" />
              <input ref={register} name="sellerType" type="hidden" />
            </Box>

            <FormGroup>
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

SellerRegisterPersonalInput.displayName = 'SellerRegisterPersonalInputPage';

// eslint-disable-next-line complexity
export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const application = await (async () => {
      const app = await getSellerApplication(ctx);

      // Return seller application if hashId is specified
      if (app) return app;

      const latestApp = await getMyLatestSellerApplication(ctx);

      // Return the latest seller application if hashId is not specified
      return latestApp;
    })();

    return {
      props: {
        namespacesRequired: ['common'],
        application,
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

export default compose([withAuth, withRouter, withTranslation('common')], SellerRegisterPersonalInput);
