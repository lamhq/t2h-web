import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import styled from 'styled-components';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { Button, ButtonLink } from '@components/atoms/Button';
import Layout from '@containers/Layout';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { Text } from '@components/atoms/Text';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';
import { createApiClient } from '@services/core';
import { ItemApi, ShopApi } from '@services/apis';
import { getItemData } from '@services/facades/item';
import ListingDetails from '@containers/ListingDetails';
import { ItemResponse, FileResponse } from '@services/types';
import ActionBar from '@components/atoms/ActionBar';

const itemApi = createApiClient(ItemApi);

const AlertHeaderContainer = styled(Flex)`
  height: 32px;
  background-color: ${({ theme }) => theme.colors.info};
`;

interface AlertHeaderProps {
  message: string;
}

const AlertHeader = ({ message }: AlertHeaderProps) => (
  <AlertHeaderContainer alignItems="center" justifyContent="center">
    <Text variant="small" color="darkGrey" fontWeight="bold" fontFamily="secondary">
      {message}
    </Text>
  </AlertHeaderContainer>
);

interface ListingAddPreviewProps extends WithTranslation {
  router: SingletonRouter;
  item: ItemResponse;
  shopImageSrcs: string[];
}

const ListingAddPreview: NextPage<ListingAddPreviewProps> = (props: ListingAddPreviewProps) => {
  const { t, router, item, shopImageSrcs } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const onPublishClick = React.useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setGlobalSpinner(true);
        await itemApi.submitItem(item.hashId);
        await router.push(`/myaccount/listing`);
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, router, setGlobalSpinner, item],
  );

  const [isPhoneNumberVisible, setIsPhoneNumberVisible] = React.useState(false);
  const onViewSellerProfileClick = React.useCallback(() => {
    setIsPhoneNumberVisible(true);
  }, [setIsPhoneNumberVisible]);

  return (
    <Layout>
      <Head>
        <title>{t('Preview a listing')}</title>
      </Head>
      <AlertHeader message={t(`This is a preview of your listing.`)} />

      <FormHeaderContainer>
        <Box width={{ _: 1, md: '720px' }}>
          <ResponsiveStepper
            currentStep={2}
            title={t(`Create a listing`)}
            steps={[t('Vehicle details'), t('Listing details'), t('Preview & Publish')]}
          />
        </Box>
      </FormHeaderContainer>
      <ListingDetails
        item={item}
        seller={item.user}
        shopImageSrcs={shopImageSrcs}
        isContactSellerVisible={true}
        isPhoneNumberVisible={isPhoneNumberVisible}
        onViewSellerProfileClick={onViewSellerProfileClick}
        isCommentsBoxVisible={false}
      />

      <Box display={{ _: 'block', md: 'none' }} mx={3}>
        <Flex mt="40px">
          <Flex flex="1 1">
            <ButtonLink href={`/listing/add?hashId=${encodeURIComponent(item.hashId)}`}>{t(`Edit listing`)}</ButtonLink>
          </Flex>
          <Flex ml="15px" flex="1 1">
            <ButtonLink variant="transparent" href={`/myaccount/listing`}>
              {t(`Save as draft`)}
            </ButtonLink>
          </Flex>
        </Flex>
        <Box mt={3} mb="24px">
          <Button backgroundColor="#ff3c35" onClick={onPublishClick}>
            {t(`Publish listing`)}
          </Button>
        </Box>
      </Box>

      <Box display={{ _: 'none', md: 'block' }}>
        <ActionBar>
          <Box backgroundColor="info">
            <Flex width="960px" height="64px" alignItems="center" mx="auto">
              <Box width="156px">
                <ButtonLink href={`/listing/add?hashId=${encodeURIComponent(item.hashId)}`}>{t(`Edit listing`)}</ButtonLink>
              </Box>
              <Box width="156px" ml={3}>
                <ButtonLink href={`/myaccount/listing`}>{t(`Save as draft`)}</ButtonLink>
              </Box>
              <Box width="156px" ml="auto">
                <Button backgroundColor="#ff3c35" onClick={onPublishClick}>
                  {t(`Publish listing`)}
                </Button>
              </Box>
            </Flex>
          </Box>
        </ActionBar>
      </Box>
    </Layout>
  );
};

ListingAddPreview.displayName = 'ListingAddPreview';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const { itemData } = await getItemData(ctx);

    if (!itemData) {
      ctx.res.writeHead(301, { Location: '/listing/add', 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' });
      ctx.res.end();
    }

    //todo: integrate shop get and user get
    const shopApi = createApiClient(ShopApi, ctx);
    const shop = await shopApi.getShopByUserHashId(itemData.userHashId).catch((error) => {
      console.error(error);

      return undefined;
    });
    const shopImageSrcs = shop ? shop.images.slice(0, 5).map((img: FileResponse) => img.url) : [];

    return {
      props: {
        namespacesRequired: ['common'],
        item: itemData,
        shopImageSrcs,
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

export default compose([withAuth, withRouter, withTranslation('common')], ListingAddPreview);
