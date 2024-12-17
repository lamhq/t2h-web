import * as React from 'react';
import Head from 'next/head';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { withAuthServerSideProps, withAuth, AuthUser } from '@hocs/withAuth';
import { createApiClient } from '@services/core';
import { UserApi, FavoriteApi, ItemApi, ShopApi, FileApi } from '@services/apis';
import { UserResponse, ItemStatus, ItemArrayResponse, ShopResponse } from '@services/types';
import { compose } from '@common/utils';
import Layout from '@containers/Layout';
import UserPublicProfileContainer from '@containers/UserPublicProfile';
import MyListingsContainer from '@containers/MyListings';
import SellerListingsContainer from '@containers/SellerListings';

const userApi = createApiClient(UserApi);
const fileApi = createApiClient(FileApi);
const itemApi = createApiClient(ItemApi);
const favoriteApi = createApiClient(FavoriteApi);
const shopApi = createApiClient(ShopApi);

const NUM_OF_ITEMS_PER_PAGE = 10;
const MIN_INTERVAL_OF_SEARCH = 1000;

interface UserPageProps extends WithTranslation {
  router: SingletonRouter;
  isOwner: boolean;
  defaultUser: UserResponse;
  defaultShop?: ShopResponse;
  // MyListings
  defaultActiveItems?: ItemArrayResponse;
  defaultDraftItems?: ItemArrayResponse;
  defaultHistoryItems?: ItemArrayResponse;
  defaultNumberOfActiveItems?: number;
  defaultNumberOfDraftItems?: number;
  defaultNumberOfHistoryItems?: number;
  // SellerListings
  defaultSellerItems?: ItemArrayResponse;
  defaultNumberOfSellerItems?: number;
}

const UserPage: NextPage<UserPageProps> = (props: UserPageProps) => {
  const {
    t,
    router,
    isOwner,
    defaultUser,
    defaultShop,
    defaultActiveItems,
    defaultDraftItems,
    defaultHistoryItems,
    defaultNumberOfActiveItems,
    defaultNumberOfDraftItems,
    defaultNumberOfHistoryItems,
    defaultSellerItems,
    defaultNumberOfSellerItems,
  } = props;

  return (
    <Layout>
      <Head>
        <title>{t(`Profile`)}</title>
      </Head>
      <UserPublicProfileContainer
        userApi={userApi}
        fileApi={fileApi}
        shopApi={shopApi}
        isOwner={isOwner}
        defaultUser={defaultUser}
        defaultShop={defaultShop}
      />
      {isOwner === true ? (
        <MyListingsContainer
          itemApi={itemApi}
          defaultActiveItems={defaultActiveItems}
          defaultDraftItems={defaultDraftItems}
          defaultHistoryItems={defaultHistoryItems}
          defaultNumberOfActiveItems={defaultNumberOfActiveItems}
          defaultNumberOfDraftItems={defaultNumberOfDraftItems}
          defaultNumberOfHistoryItems={defaultNumberOfHistoryItems}
          numberOfItemsPerPage={NUM_OF_ITEMS_PER_PAGE}
          intervalOfSearch={MIN_INTERVAL_OF_SEARCH}
        />
      ) : (
        <SellerListingsContainer
          itemApi={itemApi}
          favoriteApi={favoriteApi}
          router={router}
          user={defaultUser}
          defaultItems={defaultSellerItems}
          defaultNumberOfItems={defaultNumberOfSellerItems}
          numberOfItemsPerPage={NUM_OF_ITEMS_PER_PAGE}
          intervalOfSearch={MIN_INTERVAL_OF_SEARCH}
        />
      )}
    </Layout>
  );
};

UserPage.displayName = 'IndexPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async (ctx, authUser?: AuthUser) => {
  const { params } = ctx;
  const id = Array.isArray(params?.id) ? params.id[0] : params.id;
  const isOwner = id === authUser?.hashId;

  const userApi = createApiClient(UserApi, ctx);
  const user = await userApi.getUser(id);

  let defaultActiveItems: ItemArrayResponse | null = null;
  let defaultDraftItems: ItemArrayResponse | null = null;
  let defaultHistoryItems: ItemArrayResponse | null = null;
  let defaultSellerItems: ItemArrayResponse | null = null;

  let defaultNumberOfActiveItems = 0;
  let defaultNumberOfDraftItems = 0;
  let defaultNumberOfHistoryItems = 0;
  let defaultNumberOfSellerItems = 0;

  const itemApi = createApiClient(ItemApi, ctx);

  if (isOwner) {
    [
      [defaultActiveItems, defaultNumberOfActiveItems],
      [defaultDraftItems, defaultNumberOfDraftItems],
      [defaultHistoryItems, defaultNumberOfHistoryItems],
    ] = await Promise.all([
      itemApi.getMyItems({ page: 1, perPage: NUM_OF_ITEMS_PER_PAGE, status: ItemStatus.Published }),
      itemApi.getMyItems({ page: 1, perPage: NUM_OF_ITEMS_PER_PAGE, status: ItemStatus.Draft }),
      itemApi.getMyItems({ page: 1, perPage: NUM_OF_ITEMS_PER_PAGE, status: ItemStatus.Sold }),
    ]);
  } else {
    [defaultSellerItems, defaultNumberOfSellerItems] = await itemApi.getItems({
      page: 1,
      perPage: NUM_OF_ITEMS_PER_PAGE,
      username: user.username,
    });
  }

  // TODO: tentative error handling
  const getUserShop = async () => {
    try {
      const shopApi = createApiClient(ShopApi, ctx);

      return await shopApi.getShopByUserHashId(user.hashId);
    } catch (err) {
      return undefined;
    }
  };

  const shop = await getUserShop();

  return {
    props: {
      namespacesRequired: ['common'],
      isOwner,
      defaultUser: user,
      defaultShop: shop,
      defaultActiveItems,
      defaultDraftItems,
      defaultHistoryItems,
      defaultSellerItems,
      defaultNumberOfActiveItems: defaultNumberOfActiveItems,
      defaultNumberOfDraftItems: defaultNumberOfDraftItems,
      defaultNumberOfHistoryItems: defaultNumberOfHistoryItems,
      defaultNumberOfSellerItems: defaultNumberOfSellerItems,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], UserPage);
