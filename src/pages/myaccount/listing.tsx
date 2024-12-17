import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import MyListings from '@containers/MyListings';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { compose } from '@common/utils';
import { createApiClient } from '@services/core';
import { ItemApi, UserApi } from '@services/apis';
import { ItemStatus, ItemArrayResponse } from '@services/types';

const itemApi = createApiClient(ItemApi);
const userApi = createApiClient(UserApi);

const NUM_OF_ITEMS_PER_PAGE = 10;
const MIN_INTERVAL_OF_SEARCH = 1000;

interface MyAccountListingPageProps extends WithTranslation {
  router: SingletonRouter;
  defaultActiveItems: ItemArrayResponse;
  defaultDraftItems: ItemArrayResponse;
  defaultHistoryItems: ItemArrayResponse;
  defaultNumberOfActiveItems: number;
  defaultNumberOfDraftItems: number;
  defaultNumberOfHistoryItems: number;
}

const MyAccountListingPage: NextPage<MyAccountListingPageProps> = (props: MyAccountListingPageProps) => {
  const {
    t,
    defaultActiveItems,
    defaultDraftItems,
    defaultHistoryItems,
    defaultNumberOfActiveItems,
    defaultNumberOfDraftItems,
    defaultNumberOfHistoryItems,
  } = props;

  return (
    <Layout>
      <Head>
        <title>{t(`My Listings`)}</title>
      </Head>
      <MyAccountContainerLayout title={t('My Listings')} userApi={userApi}>
        <MyListings
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
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountListingPage.displayName = 'MyAccountListingPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  const itemApi = createApiClient(ItemApi, ctx);
  const [activeItems, draftItems, historyItems] = await Promise.all([
    itemApi.getMyItems({
      page: 1,
      perPage: NUM_OF_ITEMS_PER_PAGE,
      status: [ItemStatus.Published, ItemStatus.Submitted, ItemStatus.Pending],
    }),
    itemApi.getMyItems({
      page: 1,
      perPage: NUM_OF_ITEMS_PER_PAGE,
      status: [ItemStatus.Draft, ItemStatus.Rejected],
    }),
    itemApi.getMyItems({ page: 1, perPage: NUM_OF_ITEMS_PER_PAGE, status: ItemStatus.Sold }),
  ]);

  return {
    props: {
      namespacesRequired: ['common'],
      defaultActiveItems: activeItems[0],
      defaultNumberOfActiveItems: activeItems[1],
      defaultDraftItems: draftItems[0],
      defaultNumberOfDraftItems: draftItems[1],
      defaultHistoryItems: historyItems[0],
      defaultNumberOfHistoryItems: historyItems[1],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountListingPage);
