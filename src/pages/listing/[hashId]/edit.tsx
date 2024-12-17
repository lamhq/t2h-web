import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose, pickNotEmpty } from '@common/utils';
import { withRouter, SingletonRouter, useRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation, TFunction } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import { useForm, Controller } from 'react-hook-form';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import Grid from '@components/layouts/Grid';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Button, ButtonLink } from '@components/atoms/Button';
import { Text, TextLink } from '@components/atoms/Text';
import Dialog from '@components/molecules/Dialog';
import Card from '@components/atoms/Card';
import InputText from '@components/molecules/InputText';
import TextArea from '@components/molecules/TextArea';
import { ImageIcon, OndemandVideoIcon, RocketIcon } from '@components/atoms/IconButton';
import { Title, SubTitle } from '@components/atoms/Title';
import styled from 'styled-components';
import { ImageData } from '@components/molecules/InputImages';
import { FileCategory, FilePermission, ItemResponse, EditItemRequest, ItemStatus } from '@services/types';
import SortableInputImagesController from '@components/organisms/SortableInputImagesController';
import { createApiClient } from '@services/core';
import { ItemApi, FileApi, ProvinceMasterApi } from '@services/apis';
import { getItemData } from '@services/facades/item';
import { isAjax } from '@common/server';
import { isChrome } from '@common/utils/browser';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import Annotation from '@components/molecules/Annotation';
import FormOutline from '@components/molecules/FormOutline';
import InputHelperText from '@components/atoms/InputHelperText';
import { useScrollToError } from '@common/utils/hooks';
import ProvinceInputTextDropdownControler from '@containers/ProvinceInputTextDropdownControler';

const fileApi = createApiClient(FileApi);
const itemApi = createApiClient(ItemApi);
const provinceApi = createApiClient(ProvinceMasterApi);

const TITLE_MAX_LENGTH = 300;

enum SubmitType {
  Update = 'UPDATE',
  Cancel = 'CANCEL',
}

const TitleContainer = styled(Flex)`
  box-shadow: inset 0 -1px 0 0 #ececec;
`;

const PriceContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.boxBackgroundColor};
  padding-top: ${({ theme }) => theme.space[3]};
  padding-left: ${({ theme }) => theme.space[2]};
  padding-right: ${({ theme }) => theme.space[2]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  box-sizing: border-box;
`;

const UpgradeBanner = ({ t }: { t: TFunction }) => {
  const router = useRouter();
  const onUpgradeClick = React.useCallback(
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
        <ButtonLink onClick={onUpgradeClick} backgroundColor="#ff3c35">
          {t(`Upgrade now!`)}
        </ButtonLink>
      </Flex>
    </Card>
  );
};

interface FormData {
  title: string;
  detail: string;
  pickupLocation: string;
  markdownPrice: number;
  images: ImageData[];
}

interface ListingEditPageProps extends WithTranslation {
  router: SingletonRouter;
  itemId: string;
  itemData: ItemResponse;
}

// eslint-disable-next-line complexity
const ListingEditPage: NextPage<ListingEditPageProps> = (props: ListingEditPageProps) => {
  const { t, router, itemId, itemData } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const { register, handleSubmit, errors, control, formState, getValues } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      title: itemData.title,
      detail: itemData.detail,
      pickupLocation: itemData.pickupLocation,
      markdownPrice: itemData.markdownPrice,
      images: itemData.images.map((img) => ({ src: img.url, hashId: img.hashId })),
    },
  });

  const { scrollToError } = useScrollToError();

  React.useEffect(() => {
    scrollToError(errors);
  }, [scrollToError, errors]);

  const [submitType, setSubmitType] = React.useState(null);
  const onUpdateButtonClick = React.useCallback(() => setSubmitType(SubmitType.Update), [setSubmitType]);
  const onCancelButtonClick = React.useCallback(() => setSubmitType(SubmitType.Cancel), [setSubmitType]);

  const onSubmit = React.useCallback(
    async (data: FormData): Promise<void> => {
      if (submitType === SubmitType.Cancel) {
        router.push(`/listing/${encodeURIComponent(itemId)}`);

        return;
      }

      setGlobalSpinner(true);

      let imageUploadResults: ImageData[];

      try {
        imageUploadResults = await Promise.all(
          data.images.map(async (img: ImageData) => {
            if (img.file) {
              const result = await fileApi.uploadFile(img.file, {
                category: FileCategory.Item,
                permission: FilePermission.Public,
              });

              return { src: result.url, hashId: result.hashId };
            }

            return img;
          }),
        );

        const markdownPrice = Number(data.markdownPrice);

        //todo: put image hashids to request
        await itemApi.editItem(
          itemId,
          pickNotEmpty({
            title: data.title,
            detail: data.detail,
            pickupLocation: data.pickupLocation,
            markdownPrice: markdownPrice === 0 || markdownPrice === Number.NaN ? undefined : markdownPrice,
            imageHashIds: imageUploadResults.map((v) => v.hashId),
          }) as EditItemRequest,
        );

        router.push(`/listing/${encodeURIComponent(itemId)}`);
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSpinner, setGlobalSnackbar, router, itemId, submitType],
  );

  const [dialogTop, setDialogTop] = React.useState(0);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  const onCancelClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      const scrollHeight = document?.body.scrollTop || document?.documentElement.scrollTop || 0;

      setDialogTop(scrollHeight);
      setIsCancelDialogOpen(true);
    },
    [setIsCancelDialogOpen, setDialogTop],
  );
  const onCancelDialogClose = React.useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      setIsCancelDialogOpen(false);
    },
    [setIsCancelDialogOpen],
  );

  const onDeleteButtonClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        setGlobalSpinner(true);
        await itemApi.deleteItem(itemId);
        router.push(`/myaccount/listing`);
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, router, setGlobalSpinner, itemId],
  );

  return (
    <React.Fragment>
      <Layout>
        <Head>
          <title>{t('Edit a listing')}</title>
        </Head>
        <TitleContainer width={1}>
          <Flex alignItems="center" height={{ _: '48px', md: '78px' }} width={{ _: 1, md: '1016px' }} mx={{ _: 3, md: 'auto' }}>
            <Title
              mt={0}
              mb={0}
              color="text"
              fontSize={{ _: '19px', md: 5 }}
              lineHeight="27px"
              letterSpacing={{ _: 3, md: 4 }}
              fontWeight="bold"
            >
              {t(`Edit listing`)}
            </Title>
          </Flex>
        </TitleContainer>

        <Container width={{ _: 1, md: '968px' }} mx="auto" padding={{ _: 3, md: 0 }}>
          <Box mt={{ _: 3, md: 5 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormOutline outline={t(`Listing details`)} />
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
                        helperText={errors.title && t(errors.title.message.toString())}
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
                    <Text my={0}>{t(`After uploading tap and drag to reorder.`)}</Text>

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
                          return images.length > 0;
                        },
                      }}
                    />
                    {errors.images && <InputHelperText hasError={true}>{(errors.images as any).message}</InputHelperText>}
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
                        <UpgradeBanner t={t} />
                      </Box>
                    </Box>
                  </ResponsiveFormDescription>
                </ResponsiveFormContainer>
              </FormGroup>

              <FormGroup mt="41px" mb={4}>
                <Box display={{ _: 'block', md: 'none' }}>
                  <UpgradeBanner t={t} />
                </Box>
              </FormGroup>

              <FormGroup mt="41px">
                <ResponsiveFormContainer mt={3} mb={0}>
                  <ResponsiveFormItem>
                    <PriceContainer p={{ _: 2, md: 4 }} flexDirection="column">
                      <SubTitle mt={0} mb={0} textAlign="left">
                        {t(`Pricing`)}
                      </SubTitle>
                      <Box mt="11px">
                        <Text mt={0} mb={0} variant="small" color="text" lineHeight="20px" fontFamily="secondary">
                          {t(`Original selling price`)}
                        </Text>
                        <Text mt="6px" mb={0} variant="small" color="text" lineHeight="20px" fontFamily="secondary">
                          {`฿ ${itemData.sellingPrice ? itemData.sellingPrice.toLocaleString() : ''}`}
                        </Text>
                      </Box>
                      <Text mt={3} mb={0} variant="small" fontFamily="secondary" fontWeight="bold">
                        {t(`Markdown price (THB)`)}
                      </Text>
                      <Box width="188px" mt="3px">
                        <InputText
                          ref={register({
                            validate: (price) => {
                              if (price.length === 0) {
                                return true;
                              }

                              const numPrice = +price;

                              if (numPrice === NaN) {
                                return `${t('Please input positive number')}`;
                              }

                              if (numPrice > +itemData.sellingPrice) {
                                return `${t('Please input less price')}`;
                              }

                              return true;
                            },
                          })}
                          type="number"
                          name="markdownPrice"
                          hasError={!!errors.markdownPrice}
                          helperText={errors.markdownPrice && t(errors.markdownPrice.message.toString())}
                        />
                      </Box>
                      <Text my={0} mt={2} variant="extraSmall" color="darkGrey" fontFamily="secondary">
                        {t(
                          `*The original sales price can not be edited after publishing, however you can markdown the selling price later.`,
                        )}
                      </Text>
                    </PriceContainer>
                  </ResponsiveFormItem>
                </ResponsiveFormContainer>
              </FormGroup>

              <Box mt="40px" mb="70px" display={{ _: 'block', md: 'none' }}>
                <FormGroup>
                  <FormControl mt={0} mb={0}>
                    <Button variant={formState.isValid ? 'primary' : 'disabled'} type="submit" onClick={onUpdateButtonClick}>
                      {t(`Update listing`)}
                    </Button>
                  </FormControl>

                  <FormControl mt={3} mb={0}>
                    <Button variant="transparent" onClick={onCancelButtonClick}>
                      {t(`Cancel`)}
                    </Button>
                  </FormControl>

                  <Flex mt={3} justifyContent="center">
                    <TextLink mt={0} mb={0} color="boost" onClick={onCancelClick}>
                      {t(`Delete listing`)}
                    </TextLink>
                  </Flex>
                </FormGroup>
              </Box>
              <Box mt="40px" mb="171px" display={{ _: 'none', md: 'block' }}>
                <Flex alignItems="center">
                  <TextLink mt={0} mb={0} color="boost" onClick={onCancelClick}>
                    {t(`Delete listing`)}
                  </TextLink>
                  <Box ml="auto" width="156px">
                    <Button variant="transparent" onClick={onCancelButtonClick}>
                      {t(`Cancel`)}
                    </Button>
                  </Box>
                  <Box ml={3} width="246px">
                    <Button variant={formState.isValid ? 'primary' : 'disabled'} type="submit" onClick={onUpdateButtonClick}>
                      {t(`Update listing`)}
                    </Button>
                  </Box>
                </Flex>
              </Box>
            </form>
          </Box>
        </Container>
      </Layout>
      <Dialog
        isOpen={isCancelDialogOpen}
        onClose={onCancelDialogClose}
        showsTitle={false}
        showsCloseIcon={false}
        showsActionButton={false}
        ContainerProps={{ top: `calc(${dialogTop}px + 16px)` }}
      >
        <Box>
          <Title mt={0} mb={0} fontSize={5} color="boost" fontWeight="bold" textAlign="left">
            {t(`Pickup location`)}
          </Title>

          <Text mt="22px" mb={0} fontFamily="secondary">
            {`${t(`Are you sure you want to`)}`}
            <Text mt={0} mb={0} fontWeight="bold" fontFamily="secondary">
              {t(`permanently delete`)}
            </Text>
            {`${t(`listing?`)}`}
          </Text>
        </Box>
        <Box mt="55px">
          <FormControl mt={0} mb={0}>
            <Button variant="delete" type="submit" onClick={onDeleteButtonClick}>
              {t(`Delete listing`)}
            </Button>
          </FormControl>

          <FormControl mt={3} mb={0}>
            <Button variant="primary" onClick={onCancelDialogClose}>
              {t(`Cancel`)}
            </Button>
          </FormControl>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

ListingEditPage.displayName = 'ListingEditPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const { itemId, itemData } = await getItemData(ctx);

    if (itemData.status !== ItemStatus.Published && itemData.status !== ItemStatus.Sold) {
      const redirect = `/listing/add?hashId=${itemId}`;

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

    return {
      props: { error: { message: err.message, statusCode } },
    };
  }
});

export default compose([withAuth, withRouter, withTranslation('common')], ListingEditPage);
