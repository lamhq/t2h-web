import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter, useRouter } from 'next/router';
import Link from 'next/link';
import { withTranslation } from '@server/i18n';
import { WithTranslation, TFunction } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import { useForm, Controller } from 'react-hook-form';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Button, ButtonLink } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';
import Card from '@components/atoms/Card';
import InputText from '@components/molecules/InputText';
import TextArea from '@components/molecules/TextArea';
import { ArrowBackIcon, ImageIcon, OndemandVideoIcon, RocketIcon, WarningIcon } from '@components/atoms/IconButton';
import { Title, SubTitle } from '@components/atoms/Title';
import styled from 'styled-components';
import { ImageData } from '@components/molecules/InputImages';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { createApiClient } from '@services/core';
import { ItemApi, FileApi, ProvinceMasterApi } from '@services/apis';
import { getItemData } from '@services/facades/item';
import { FileCategory, FilePermission, ItemResponse } from '@services/types';
import SortableInputImagesController from '@components/organisms/SortableInputImagesController';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import Annotation from '@components/molecules/Annotation';
import FormOutline from '@components/molecules/FormOutline';
import Grid from '@components/layouts/Grid';
import { uploadImageIfNotUploaded } from '@services/facades/file';
import Dialog from '@components/molecules/Dialog';
import Alert from '@components/molecules/Alert';
import InputHelperText from '@components/atoms/InputHelperText';
import ProvinceInputTextDropdownControler from '@containers/ProvinceInputTextDropdownControler';
import { useScrollToError } from '@common/utils/hooks';
import { isAjax } from '@common/server';
import { isChrome } from '@common/utils/browser';

const fileApi = createApiClient(FileApi);
const itemApi = createApiClient(ItemApi);
const provinceApi = createApiClient(ProvinceMasterApi);

const BackButtonContainer = styled(Box)`
  cursor: pointer;
`;

const TITLE_MAX_LENGTH = 300;

enum SubmitType {
  SaveAsDraft = 'SAVE_AS_DRAFT',
  Continue = 'CONTINUE',
}

const PriceContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.boxBackgroundColor};
  box-sizing: border-box;
`;

interface FormData {
  title: string;
  detail: string;
  pickupLocation: string;
  sellingPrice: string;
  images: ImageData[];
}

interface UpgradeBannerProps {
  onSaveAsDraftButtonClick?: (e: React.MouseEvent) => void;
  t: TFunction;
}

const UpgradeBanner = ({ t, onSaveAsDraftButtonClick }: UpgradeBannerProps) => {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const handleOpenDialog = () => {
    setIsPopupVisible(true);
  };

  const onPopupClose = React.useCallback(() => {
    setIsPopupVisible(false);
  }, []);

  const onFinishButtonClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      router.push('/myaccount/membership');
    },
    [router],
  );

  return (
    <Card backgroundColor="text" overflow="hidden">
      <Title mt="22px" mb={0} mx="24px" color="white" fontSize="19px" lineHeight="27px" letterSpacing={3}>
        {t(`Upgrade for extra images and video on your listings!`)}
      </Title>
      <Flex mt={3} mb={0} alignItems="center" justifyContent="center">
        <ImageIcon size="22px" color="white" />
        <Text mt={0} mb={0} ml="5px" color="white" fontFamily="secondary">
          {t(`20 images`)}
        </Text>
      </Flex>
      <Flex mt={3} mb={0} alignItems="center" justifyContent="center">
        <OndemandVideoIcon size="22px" color="white" />
        <Text mt={0} mb={0} ml="5px" color="white" fontFamily="secondary">
          {t(`Video upload`)}
        </Text>
      </Flex>
      <Flex mt={3} mb={0} alignItems="center" justifyContent="center">
        <RocketIcon size="22px" color="white" />
        <Text mt={0} mb={0} ml="5px" color="white" fontFamily="secondary">
          {t(`Boosted listings`)}
        </Text>
      </Flex>
      <Flex mt="24px" mb={4} mx="14px">
        <ButtonLink onClick={handleOpenDialog} backgroundColor="#ff3c35">
          {t(`Upgrade now!`)}
        </ButtonLink>
        <Dialog
          isOpen={isPopupVisible}
          onClose={onPopupClose}
          showsTitle={true}
          showsCloseIcon={true}
          showsActionButton={true}
          title={t(`Leaving listing draft`)}
          actions={[
            { label: t(`Proceed`), onActionClick: onFinishButtonClick },
            {
              label: t(`Save as Draft`),
              onActionClick: onSaveAsDraftButtonClick,
              transparent: true,
            },
          ]}
        >
          <Box mb="103px">
            <Alert icon={<WarningIcon size="90px" color="warning" />} title={t(`Any unsaved progress will be lost. proceed anyway?`)} />
          </Box>
        </Dialog>
      </Flex>
    </Card>
  );
};

interface ListingAddDetailsProps extends WithTranslation {
  router: SingletonRouter;
  itemId: string;
  itemData: ItemResponse;
}

const ListingAddDetails: NextPage<ListingAddDetailsProps> = (props: ListingAddDetailsProps) => {
  const { t, router, itemId, itemData } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const { register, handleSubmit, errors, control, getValues, formState, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      title: itemData.title,
      detail: itemData.detail,
      pickupLocation: itemData.pickupLocation,
      sellingPrice: itemData.sellingPrice?.toString() || '',
      images: itemData.images.map((img) => ({
        src: img.url,
        hashId: img.hashId,
      })),
    },
  });

  const { scrollToError } = useScrollToError();

  React.useEffect(() => {
    scrollToError(errors);
  }, [scrollToError, errors]);

  const [submitType, setSubmitType] = React.useState(null);
  const onSaveDraftButtonClick = React.useCallback(() => setSubmitType(SubmitType.SaveAsDraft), [setSubmitType]);
  const onContinueButtonClick = React.useCallback(() => setSubmitType(SubmitType.Continue), [setSubmitType]);

  const onSubmit = React.useCallback(
    async (data: FormData) => {
      let newImages: ImageData[] = [];

      try {
        setGlobalSpinner(true);

        newImages = await Promise.all(
          data.images.map(async (img: ImageData) =>
            uploadImageIfNotUploaded(fileApi, img, {
              category: FileCategory.Item,
              permission: FilePermission.Public,
            }),
          ),
        );

        await itemApi.editItem(itemId, {
          title: data.title,
          detail: data.detail,
          pickupLocation: data.pickupLocation,
          sellingPrice: Number(data.sellingPrice),
          imageHashIds: newImages.map((v) => v.hashId),
        });
        if (!submitType || submitType === SubmitType.SaveAsDraft) {
          setGlobalSnackbar({ message: t('Your listing has been saved as draft'), variant: 'success' });
        } else {
          router.push(`/listing/add/${encodeURIComponent(itemId)}/preview`);
        }
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
        reset({
          ...data,
          images: newImages,
        });
      }
    },
    [t, setGlobalSnackbar, setGlobalSpinner, reset, router, itemId, submitType],
  );

  return (
    <Layout>
      <Head>
        <title>{t('Create a listing')}</title>
      </Head>

      <FormHeaderContainer>
        <Box width={{ _: 1, md: '720px' }}>
          <ResponsiveStepper
            currentStep={1}
            title={t(`Create a listing`)}
            steps={[t('Vehicle details'), t('Listing details'), t('Preview & Publish')]}
          />
        </Box>
        <Box display={{ _: 'none', md: 'block' }} ml="auto" my="auto" width="160px">
          <Button variant="transparent" type="submit" onClick={onSaveDraftButtonClick}>
            {t(`Save as draft`)}
          </Button>
        </Box>
      </FormHeaderContainer>

      <Container width={{ _: 1, md: '968px' }} mx="auto" padding={{ _: 3, md: 0 }}>
        <Box pt={{ _: 0, md: 3 }}>
          <Link href={`/listing/add?hashId=${encodeURIComponent(itemId)}`}>
            <BackButtonContainer>
              <Flex alignItems="center" mb="15px">
                <ArrowBackIcon size="16px" color="text" />
                <Text my={0} ml="10px" variant="small" fontFamily="secondary">
                  {t(`Back to vehicle details`)}
                </Text>
              </Flex>
            </BackButtonContainer>
          </Link>
        </Box>
        <Box mt={{ _: 3, md: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Box display={{ _: 'none', md: 'block' }}>
                <FormOutline outline={t(`Listing details`)} />
              </Box>
              <ResponsiveFormContainer mt={3} mb={0}>
                <ResponsiveFormItem>
                  <FormControl mt={3} mb={0}>
                    <InputText
                      ref={register({
                        required: { value: true, message: `${t('Title')} ${t('is required')}` },
                        maxLength: TITLE_MAX_LENGTH,
                      })}
                      type="text"
                      maxLength={TITLE_MAX_LENGTH}
                      name="title"
                      label={t(`Listing title`)}
                      hasError={!!errors.title}
                      helperText={errors.title ? t(errors.title.message.toString()) : t(`Max characters 150`)}
                    />
                  </FormControl>

                  <FormControl mt={3} mb={0}>
                    <TextArea
                      ref={register({
                        required: { value: true, message: `${t('Details')} ${t('are required')}` },
                      })}
                      rows={4}
                      minRows={4}
                      maxRows={10}
                      name="detail"
                      label={t(`Details`)}
                      hasError={!!errors.detail}
                      helperText={errors.detail && t(errors.detail.message.toString())}
                    />
                  </FormControl>

                  <FormControl mt={3} mb={0}>
                    <ProvinceInputTextDropdownControler
                      provinceApi={provinceApi}
                      name="pickupLocation"
                      control={control}
                      label={t(`Pickup location`)}
                      defaultValue={getValues('pickupLocation')}
                      errors={errors}
                      rules={{
                        required: { value: true, message: `${t('Pickup location')} ${t('is required')}` },
                      }}
                    />
                  </FormControl>
                </ResponsiveFormItem>
                <ResponsiveFormDescription>
                  <Box display={{ _: 'none', md: 'block' }}>
                    <Annotation title={t('Help title')}>
                      <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                        {t('Please avoid shadows and blurry images.')}
                      </Text>
                    </Annotation>
                  </Box>
                </ResponsiveFormDescription>
              </ResponsiveFormContainer>
            </FormGroup>

            <FormGroup>
              <SubTitle my={0} textAlign="left">
                {t(`Listing images`)}
              </SubTitle>
              <ResponsiveFormContainer mt={3} mb={0}>
                <ResponsiveFormItem>
                  <Text my={0} mt="5px" fontWeight="bold">
                    {t(`You can add up to 6 images.`)}
                  </Text>

                  <Text my={0}>{t(`After uploading tap and drag to reorder.`)}</Text>
                  <Box mt={{ _: 3, md: '23px' }}>
                    <Controller
                      as={
                        <SortableInputImagesController
                          defaultImages={getValues('images')}
                          maximumNumber={6}
                          mainImageTitle={'Primary image'}
                          hasError={!!errors.images}
                        />
                      }
                      name="images"
                      control={control}
                      onChange={(changes) => {
                        return changes.length > 0 && changes[0].length > 0 ? changes[0] : undefined;
                      }}
                      rules={{
                        required: { value: true, message: `${t('Images')} ${t('are required')}` },
                        validate: (images) => {
                          return images.length > 0 ? true : `${t('Images')} ${t('are required')}`;
                        },
                      }}
                    />
                    {errors.images && <InputHelperText hasError={true}>{(errors.images as any).message}</InputHelperText>}
                  </Box>
                </ResponsiveFormItem>
                <ResponsiveFormDescription>
                  <Box display={{ _: 'none', md: 'block' }}>
                    <Box>
                      <Annotation title={t('Please take a clear making sure to avoid blurry images and reflections.')}>
                        <Text mt={0} mb={0} variant="small" color="placeholder" fontFamily="secondary">
                          {t('We suggest taking pictures of each side of the vehicle, close ups of tires and the inside ')}
                        </Text>
                      </Annotation>
                    </Box>
                    <Box mt={3}>
                      <Grid display="grid" alignItems="center" gridTemplateColumns="repeat(2, 1fr)" gridColumnGap={3}>
                        <Grid>
                          <Card backgroundColor="#d3d3d3" height="155px">
                            <Flex alignItems="center" justifyContent="center" height="100%">
                              <Text mt={0} mb={0} color="menuText" fontFamily="secondary">
                                {t('example image good')}
                              </Text>
                            </Flex>
                          </Card>
                        </Grid>
                        <Grid>
                          <Card backgroundColor="#d3d3d3" height="155px">
                            <Flex alignItems="center" justifyContent="center" height="100%">
                              <Text mt={0} mb={0} color="menuText" fontFamily="secondary">
                                {t('example image good')}
                              </Text>
                            </Flex>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box display={{ _: 'none', md: 'block' }} mt={3}>
                      <UpgradeBanner t={t} onSaveAsDraftButtonClick={handleSubmit(onSubmit)} />
                    </Box>
                  </Box>
                </ResponsiveFormDescription>
              </ResponsiveFormContainer>
            </FormGroup>

            <FormGroup mt="41px" mb={4}>
              <Box display={{ _: 'block', md: 'none' }}>
                <UpgradeBanner t={t} onSaveAsDraftButtonClick={handleSubmit(onSubmit)} />
              </Box>
            </FormGroup>

            <FormGroup mt="41px">
              <ResponsiveFormContainer mt={3} mb={0}>
                <ResponsiveFormItem>
                  <PriceContainer p={{ _: 2, md: 4 }} flexDirection="column">
                    <SubTitle mt={0} mb={0} textAlign="left">{`${t(`Pricing`)} *`}</SubTitle>
                    <Text my={0} mt="3px" variant="small" fontFamily="secondary" fontWeight="bold">
                      {t(`Selling price (THB)`)}
                    </Text>
                    <Box width="188px" mt="3px">
                      <InputText
                        ref={register({
                          required: { value: true, message: `${t('Selling price')} ${t('is required')}` },
                          validate: (price) => {
                            if (+price === NaN) {
                              const message = t('Please input positive number');

                              return message;
                            }

                            return true;
                          },
                        })}
                        type="number"
                        name="sellingPrice"
                        hasError={!!errors.sellingPrice}
                        helperText={errors.sellingPrice && t(errors.sellingPrice.message.toString())}
                      />
                    </Box>
                    <Text my={0} mt={2} variant="extraSmall" color="darkGrey" fontFamily="secondary">
                      {t(`*The original sales price can not be edited after publishing, however you can markdown the selling price later.`)}
                    </Text>
                  </PriceContainer>
                </ResponsiveFormItem>
              </ResponsiveFormContainer>
            </FormGroup>

            <Flex mt={{ _: 5, md: '27px' }} mb={{ _: 0, md: '108px' }} flexDirection={{ _: 'column', md: 'row' }}>
              <Box width={{ _: 1, md: '160px' }} ml={{ _: 0, md: 'auto' }}>
                <Button variant="transparent" type="submit" onClick={onSaveDraftButtonClick}>
                  {t(`Save as draft`)}
                </Button>
              </Box>
              <Box mt={{ _: '15px', md: 0 }} width={{ _: 1, md: '246px' }} ml={{ _: 0, md: 3 }}>
                <Button variant={formState.isValid ? 'primary' : 'disabled'} type="submit" onClick={onContinueButtonClick}>
                  {t(`Continue`)}
                </Button>
              </Box>
            </Flex>
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

ListingAddDetails.displayName = 'ListingAddDetails';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const { itemId, itemData } = await getItemData(ctx);

    if (!itemData) {
      const redirect = '/listing/add';

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
        itemId,
        itemData,
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

export default compose([withAuth, withRouter, withTranslation('common')], ListingAddDetails);
