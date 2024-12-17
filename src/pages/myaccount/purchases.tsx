import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { withRouter, SingletonRouter } from 'next/router';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { SectionTitle } from '@components/atoms/Title';
import { withAuth, withAuthServerSideProps, RedirectAction } from '@hocs/withAuth';
import Box from '@components/layouts/Box';
import PaymentApi from '@services/apis/payment';
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import { ChargeArrayResponse, ScheduleChargeArrayResponse } from '@services/types';
import ChargeListItem from '@components/molecules/ChargeListItem';

const userApi = createApiClient(UserApi);

interface MyAccountPurchasesPageProps extends WithTranslation {
  router: SingletonRouter;
  charges: ChargeArrayResponse;
  schedules: ScheduleChargeArrayResponse;
}

const MyAccountPurchasesPage: React.FC<MyAccountPurchasesPageProps> = ({ t, charges, schedules }: MyAccountPurchasesPageProps) => {
  return (
    <Layout>
      <Head>
        <title>{t('My Purchases')}</title>
      </Head>
      <MyAccountContainerLayout title={t('My Purchases')} userApi={userApi}>
        <Box>
          <SectionTitle mt={0} textAlign="left">
            {t('Active subscriptions')}
          </SectionTitle>
          {/* Temporary */}
          {schedules.length > 0 &&
            schedules.map((schedule, idx) => (
              <ChargeListItem
                key={idx}
                title={t(schedule.charge.metadata.product.type)}
                description={t(schedule.charge.description)}
                cost={`${(schedule.charge.metadata.product.price / 100).toLocaleString()} THB`}
              />
            ))}
        </Box>

        <Box mt={4}>
          <SectionTitle textAlign="left">{t('Charges history')}</SectionTitle>
          {/* Temporary */}
          {charges.length > 0 &&
            charges.map((charge, idx) => (
              <ChargeListItem
                key={idx}
                title={t(charge.metadata.product.type)}
                description={t(charge.description)}
                cost={`${(charge.metadata.product.price / 100).toLocaleString()} THB`}
              />
            ))}
        </Box>
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountPurchasesPage.displayName = 'MyAccountPurchasesPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  const paymentApi = createApiClient(PaymentApi, ctx);
  const [schedules, charges] = await Promise.all([
    paymentApi.getScheduleCharges({ page: 1, active: true }),
    paymentApi.getCharges({ page: 1 }),
  ]);

  return {
    props: {
      namespacesRequired: ['common'],
      charges,
      schedules,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountPurchasesPage);
