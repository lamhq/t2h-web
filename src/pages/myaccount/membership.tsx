import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { withRouter, SingletonRouter } from 'next/router';
import Layout from '@containers/Layout';
import MyAccountContainerLayout from '@containers/MyAccountContainerLayout';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { Title } from '@components/atoms/Title';
import { withAuth, withAuthServerSideProps, RedirectAction, useAuthContext, UserMembership } from '@hocs/withAuth';
import {
  MembershipBuyerCard,
  MembershipSellerCard,
  MembershipSellerProCard,
  MembershipSellerSilverCard,
  MembershipSellerGoldCard,
} from '@components/organisms/MembershipCard';
import Box from '@components/layouts/Box';
import PaymentApi from '@services/apis/payment';
import { ProductArrayResponse, ProductResponse } from '@services/types';
import { createApiClient } from '@services/core';
import { Membership } from '@services/types/membership';
import { UserApi } from '@services/apis';

const userApi = createApiClient(UserApi);

/**
 * All membership packages in upgrade order
 */
const packages = Object.values(Membership);

function isDowngrade(item1: string, item2: string): boolean {
  const idx1 = packages.findIndex((item) => item === item1);
  const idx2 = packages.findIndex((item) => item === item2);

  return idx1 > idx2;
}

interface MyAccountMembershipPageProps extends WithTranslation {
  router: SingletonRouter;
  products: ProductArrayResponse;
}

const MyAccountMembershipPage: React.FC<MyAccountMembershipPageProps> = ({ t, products }: MyAccountMembershipPageProps) => {
  const user = useAuthContext();

  const membershipCardDict: Record<UserMembership, React.ComponentType<any>> = {
    basic: MembershipSellerCard,
    pro: MembershipSellerProCard,
    silver: MembershipSellerSilverCard,
    gold: MembershipSellerGoldCard,
  };

  return (
    <Layout>
      <Head>
        <title>{t('Memberships')}</title>
      </Head>
      <MyAccountContainerLayout title={t('Memberships')} userApi={userApi}>
        {/* <AlertMessage variant="warning">
          <MessageTitle>
            <SyncIcon color="white" />
            &nbsp;
            <span>{t('In review')}</span>
          </MessageTitle>
          {t('Your seller application is currently being checked and we’ll let you know soon')}
        </AlertMessage> */}

        <Box mb={5}>
          {(() => {
            if (user.isBuyer) {
              return <MembershipBuyerCard />;
            } else if (user.membership && user.membership === 'basic') {
              // eslint-disable-next-line security/detect-object-injection
              const MembershipCard = membershipCardDict[user.membership];

              return <MembershipCard buttonText={t('Current package')} />;
            } else if (user.membership && user.membership !== 'basic') {
              // eslint-disable-next-line security/detect-object-injection
              const MembershipCard = membershipCardDict[user.membership];

              return <MembershipCard buttonText={t('Cancel package')} buttonLink={'/membership/cancel'} buttonVariant="warning" />;
            }
          })()}
        </Box>

        <Title mt={0} fontSize="23px" color="#333" textAlign="left">
          {t('Memberships Upgrades')}
        </Title>

        {user.isBuyer && (
          <Box mb={3}>
            <MembershipSellerCard buttonText={t('Become a seller')} buttonLink="/seller/register" />
          </Box>
        )}
        {!user.isBuyer &&
          (() => {
            return products.map((p: ProductResponse, idx: number) => {
              const membership = p.metadata['membership'];

              if (!membership && membership === 'basic' && membership === 'pro' && membership === 'silver' && membership === 'gold') {
                return undefined;
              }

              // eslint-disable-next-line security/detect-object-injection
              const MembershipCard = membershipCardDict[membership];
              const perLabel = p.paymentType === 'monthly' ? 'month' : 'year';
              const priceLabel = `${p.price / 100} THB / ${t(perLabel)}`;
              const isCurrent = user.membership === membership;
              const buttonLink = isCurrent ? '/purchase/membership/cancel' : `/purchase/membership/upgrade?p=${p.hashId}`;
              const buttonText = (() => {
                if (isCurrent) {
                  return t('Cancel package');
                } else if (isDowngrade(user.membership, membership)) {
                  return t('Downgrade');
                } else {
                  return t('Upgrade');
                }
              })();
              const buttonVariant = isCurrent ? 'warning' : 'success';

              return (
                <Box key={idx} mb={3}>
                  <MembershipCard priceLabel={priceLabel} buttonText={buttonText} buttonLink={buttonLink} buttonVariant={buttonVariant} />
                </Box>
              );
            });
          })()}
      </MyAccountContainerLayout>
    </Layout>
  );
};

MyAccountMembershipPage.displayName = 'MyAccountMembershipPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  const paymentApi = createApiClient(PaymentApi, ctx);
  const products = (await paymentApi.getProducts()).filter((p) => p.type === 'membership');

  return {
    props: {
      namespacesRequired: ['common'],
      products,
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MyAccountMembershipPage);
