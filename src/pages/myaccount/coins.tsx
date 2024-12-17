import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { withRouter, SingletonRouter } from 'next/router';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { withAuth, withAuthServerSideProps, RedirectAction } from '@hocs/withAuth';
import UserBalance from '@containers/UserBalance';
import Flex from '@components/layouts/Flex';
import { Tabs, Tab, TabPanel } from '@components/molecules/Tab';
import CoinMenuItem from '@components/molecules/CoinMenuItem';
import Box from '@components/layouts/Box';
import UserBalanceHistoryList from '@containers/UserBalanceHistoryList';
import { createApiClient } from '@services/core';
import { UserApi, BalanceHistoryApi } from '@services/apis';
import PaymentApi from '@services/apis/payment';
import { ProductArrayResponse } from '@services/types';

const userApi = createApiClient(UserApi);
const historyApi = createApiClient(BalanceHistoryApi);

interface MyAccountCoinPageProps extends WithTranslation {
  products: ProductArrayResponse;
  router: SingletonRouter;
}

const MyAccountCoinPage: React.FC<MyAccountCoinPageProps> = ({ t, products }: MyAccountCoinPageProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <Head>
        <title>{t('Coins')}</title>
      </Head>
      <MyAccountContainerLayout title={t('Coins')} userApi={userApi}>
        <Flex justifyContent="center">
          <Flex width={{ _: 1, md: '500px' }} justifyContent="center" flexDirection="column" alignItems="center">
            <UserBalance />
            <Tabs variant="fullWidth" value={activeTab} onChange={handleTabChange}>
              <Tab label={t('Buy coins')} />
              <Tab label={t('History')} />
            </Tabs>
            <TabPanel width="100%" value={activeTab} index={0}>
              {products.map((p, idx) => {
                const priceThb = p.price / 100;
                const boostCnt = p.metadata['boosts'] ?? 0;
                const href = `/purchase/coin?p=${p.hashId}`;

                return (
                  <Box mt={idx === 0 ? 0 : 2} key={idx}>
                    <CoinMenuItem
                      href={href}
                      amount={`${priceThb} coins`}
                      description={`${boostCnt} ${t('boost')}`}
                      price={`${priceThb} THB`}
                    />
                  </Box>
                );
              })}
            </TabPanel>
            <TabPanel width="100%" value={activeTab} index={1}>
              <UserBalanceHistoryList historyApi={historyApi} />
            </TabPanel>
          </Flex>
        </Flex>
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountCoinPage.displayName = 'MyAccountCoinPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  const paymentApi = createApiClient(PaymentApi, ctx);
  const products = (await paymentApi.getProducts()).filter((p) => p.type === 'coin');

  return {
    props: {
      namespacesRequired: ['common'],
      products,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountCoinPage);
