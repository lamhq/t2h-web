import React, { useCallback } from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { Title } from '@components/atoms/Title';
import IconTextLink from '@components/molecules/IconTextLink';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import { GetServerSideProps } from 'next';
import { withAuth, withAuthServerSideProps, RedirectAction, UserMembership } from '@hocs/withAuth';
import { withRouter, SingletonRouter } from 'next/router';
import { MembershipSellerProCard, MembershipSellerSilverCard, MembershipSellerGoldCard } from '@components/organisms/MembershipCard';
import Box from '@components/layouts/Box';
import PaymentApi from '@services/apis/payment';
import { createApiClient } from '@services/core';
import { ProductResponse, CardArrayResponse } from '@services/types';
import { Text } from '@components/atoms/Text';
import PaymentWithOmiseCardForm from '@containers/PaymentWithOmiseCardForm';
import PaymentForm from '@containers/PaymentForm';
import Flex from '@components/layouts/Flex';

const { publicRuntimeConfig } = getConfig();
const paymentApi = createApiClient(PaymentApi);

interface MembershipUpgradePageProps extends WithTranslation {
  router: SingletonRouter;
  product: ProductResponse;
  cards: CardArrayResponse;
}

const MembershipUpgradePage: React.FC<MembershipUpgradePageProps> = ({ t, product, cards, router }: MembershipUpgradePageProps) => {
  const membershipCardDict: Record<UserMembership, React.ComponentType<any>> = {
    basic: undefined,
    pro: MembershipSellerProCard,
    silver: MembershipSellerSilverCard,
    gold: MembershipSellerGoldCard,
  };
  const { omise } = publicRuntimeConfig;
  const recaptcha = publicRuntimeConfig.recaptcha.siteKey || 'temp';

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>{t('Membership')}</title>
      </Head>
      <Container>
        <Flex alignItems="center" justifyContent="center">
          <Box width={{ _: 1, md: '720px' }}>
            <IconTextLink icon={<ArrowBackIcon size="14px" />} onClick={handleClick}>
              {t('Back to memberships')}
            </IconTextLink>
            <Title textAlign="left">{t('Selected upgrade package')}</Title>

            {(() => {
              const membership = product.metadata['membership'];

              if (!membership && membership === 'pro' && membership === 'silver' && membership === 'gold') {
                return undefined;
              }

              // eslint-disable-next-line security/detect-object-injection
              const MembershipCard = membershipCardDict[membership] || MembershipSellerProCard;
              const perLabel = product.paymentType === 'monthly' ? 'month' : 'year';
              const priceLabel = `${product.price / 100} THB / ${t(perLabel)}`;

              return <MembershipCard priceLabel={priceLabel} hasButton={false} />;
            })()}

            {cards.length === 0 && <Text fontWeight="bold">{t('Your credit cards are not found')}</Text>}

            {cards.length > 0 && (
              <Box mt={3}>
                <Text mt={0} mb={1} fontWeight="bold">
                  {t('Credit cards')}
                </Text>
                <PaymentForm paymentApi={paymentApi} cards={cards} product={product} recaptcha={recaptcha} />
              </Box>
            )}

            <Box mt={3}>
              <PaymentWithOmiseCardForm
                buttonVariant="transparent"
                paymentApi={paymentApi}
                product={product}
                omisePublicKey={omise.publicKey}
                recaptcha={recaptcha}
              />
            </Box>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

MembershipUpgradePage.displayName = 'MembershipUpgradePage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const hashId = ctx.query.p || '';
    const paymentApi = createApiClient(PaymentApi, ctx);
    const [allProducts, cards] = await Promise.all([paymentApi.getProducts(), paymentApi.getCards()]);
    const products = allProducts.filter((p) => p.type === 'membership');
    const product = products.find((p) => p.hashId === hashId) || products[0];

    return {
      props: {
        namespacesRequired: ['common'],
        product,
        cards,
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

export default compose([withAuth, withRouter, withTranslation('common')], MembershipUpgradePage);
