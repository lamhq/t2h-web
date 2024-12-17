import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import ListingItem from '@components/molecules/ListingItem';
import { Button } from '@components/atoms/Button';
import { OuterTitle, SubTitle } from '@components/atoms/Title';
import { MoreVertIcon, GreenCheckIcon } from '@components/atoms/IconButton';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import InputText from '@components/molecules/InputText';
import TextArea from '@components/molecules/TextArea';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import ListingItemBig from '@components/molecules/ListingItemBig';
import { ItemResponse, ItemStatus, ReportItemRequest, ReportReason, FileCategory, FilePermission } from '@services/types';
import { getItemData } from '@services/facades/item';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { compose, pickNotEmpty } from '@common/utils';
import { REPORT_REASON_OPTIONS } from '@constants/formdata';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { ItemApi, FileApi } from '@services/apis';
import { createApiClient } from '@services/core';
import { ImageData, StandardInputImages } from '@components/molecules/InputImages';
import FormOutline from '@components/molecules/FormOutline';
import { NotificationType } from './index';

interface ReportFormValues {
  details: string;
  attachments: ImageData[];
}

interface ListingReportPageProps extends WithTranslation {
  item: ItemResponse;
}

const fileApi = createApiClient(FileApi);
const itemApi = createApiClient(ItemApi);

const ListingReportPage: React.FC<ListingReportPageProps> = ({ t, item }: ListingReportPageProps) => {
  const router = useRouter();
  const { handleSubmit, errors, formState, control } = useForm({
    mode: 'onChange',
    defaultValues: {
      details: '',
      attachments: [],
    },
  });
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  let reasonItem = null;
  const { reason } = router.query;
  const reasonText = reason && (reasonItem = REPORT_REASON_OPTIONS.find((option) => option.value === reason)) ? reasonItem.label : '';
  const buttonVariant = formState.isValid ? 'primary' : 'disabled';

  const onSubmit = async (formData: ReportFormValues) => {
    let imageUploadResults: ImageData[];

    try {
      setGlobalSpinner(true);
      imageUploadResults = await Promise.all(
        formData.attachments.map(async (img: ImageData) => {
          if (img.file) {
            const result = await fileApi.uploadFile(img.file, {
              category: FileCategory.FraudReport,
              permission: FilePermission.Public,
            });

            return { src: result.url, hashId: result.hashId };
          }

          return img;
        }),
      );
      const reqData = pickNotEmpty({
        itemHashId: item.hashId,
        type: reason as ReportReason,
        content: formData.details,
        attachmentFileHashId: imageUploadResults.length > 0 ? imageUploadResults[0].hashId : null,
      }) as ReportItemRequest;

      await itemApi.reportItem(reqData);

      router.push(`/listing/${encodeURIComponent(item.hashId)}?notificationType=${encodeURIComponent(NotificationType.ListingReported)}`);
    } catch (err) {
      setGlobalSnackbar({ message: t(err.message), variant: 'error' });
    } finally {
      setGlobalSpinner(false);
    }
  };

  React.useEffect(() => {
    if (!reasonText) {
      router.push(`/listing/${encodeURIComponent(item.hashId)}`);
    }
  }, [reasonText, router, item.hashId]);

  if (!reasonText) return null;

  return (
    <Layout>
      <Head>
        <title>{t('Report listing')}</title>
      </Head>
      <OuterTitle fontSize="23px" color="#333" textAlign="left">
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={0} mb={0}>
          <Box width={{ _: 1, md: '968px' }}>{t('Report listing')}</Box>
        </Flex>
      </OuterTitle>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={0} mb={0}>
          <Box width={{ _: 1, md: '500px' }}>
            <Box mt={0} mb={'32px'}>
              <Box display={{ _: 'block', md: 'none' }}>
                <ListingItem
                  imageUrl={item.imageUrl}
                  title={item.title}
                  tags={[item.productionYear.toString(), item.transmission]}
                  price={`${item.sellingPrice} THB`}
                  leftTopElement={item.status === ItemStatus.Published ? <GreenCheckIcon /> : null}
                  hasBorder
                  rightTopElement={<MoreVertIcon size="18px" />}
                />
              </Box>
              <Box display={{ _: 'none', md: 'block' }}>
                <ListingItemBig
                  imageUrl={item.imageUrl}
                  title={item.title}
                  tags={[item.productionYear.toString(), item.transmission]}
                  price={`${item.sellingPrice} THB`}
                />
              </Box>
            </Box>
            <SubTitle fontSize={3} textAlign="left" mb={3}>
              {t('Report details')}
            </SubTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <FormControl>
                  <InputText type="text" label={t('Report type')} value={reasonText} isPlainText />
                </FormControl>
              </FormGroup>

              <FormGroup>
                <FormControl>
                  <Controller
                    name="details"
                    label={t('Details')}
                    as={TextArea}
                    control={control}
                    rules={{ required: true }}
                    placeholder={t('Provide additional information')}
                  />
                  {errors.details && <span>This field is required</span>}
                </FormControl>
              </FormGroup>

              <FormGroup>
                <FormOutline outline={t('Attachments')} />
                <FormControl>
                  <Controller name="attachments" as={StandardInputImages} control={control} maximumNumber={1} />
                </FormControl>
              </FormGroup>

              <FormGroup>
                <FormControl>
                  <Box display={{ _: 'none', md: 'block' }}>
                    <Flex justifyContent="flex-end">
                      <Button type="submit" variant={buttonVariant} disabled={!formState.isValid} block={false}>
                        {t('Report listing')}
                      </Button>
                    </Flex>
                  </Box>
                  <Box display={{ _: 'block', md: 'none' }}>
                    <Button type="submit" variant={buttonVariant} disabled={!formState.isValid}>
                      {t('Report listing')}
                    </Button>
                  </Box>
                </FormControl>
              </FormGroup>
            </form>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.None)(async (ctx) => {
  const { itemData } = await getItemData(ctx);

  return {
    props: {
      namespacesRequired: ['common'],
      item: itemData,
    },
  };
});

export default compose([withAuth, withTranslation('common')], ListingReportPage);
