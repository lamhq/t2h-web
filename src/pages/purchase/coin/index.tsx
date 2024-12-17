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
import { withAuth, withAuthServerSideProps, RedirectAction } from '@hocs/withAuth';
import { withRouter, SingletonRouter } from 'next/router';
import Box from '@components/layouts/Box';
import PaymentApi from '@services/apis/payment';
import { createApiClient } from '@services/core';
import { ProductResponse, CardArrayResponse } from '@services/types';
import { Text } from '@components/atoms/Text';
import PaymentWithOmiseCardForm from '@containers/PaymentWithOmiseCardForm';
import PaymentForm from '@containers/PaymentForm';
import CoinMenuItem from '@components/molecules/CoinMenuItem';
import Flex from '@components/layouts/Flex';

const { publicRuntimeConfig } = getConfig();
const paymentApi = createApiClient(PaymentApi);

interface PurchaseCoinPageProps extends WithTranslation {
  router: SingletonRouter;
  product: ProductResponse;
  cards: CardArrayResponse;
}

const PurchaseCoinPage: React.FC<PurchaseCoinPageProps> = ({ t, product, cards, router }: PurchaseCoinPageProps) => {
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
              {t('Back to coins')}
            </IconTextLink>
            <Title textAlign="left">{t('Selected coin package')}</Title>

            {(() => {
              const priceThb = product.price / 100;
              const boostCnt = product.metadata['boosts'] ?? 0;

              return (
                <Box mt={2}>
                  <CoinMenuItem amount={`${priceThb} coins`} description={`${boostCnt} ${t('boost')}`} price={`${priceThb} THB`} />
                </Box>
              );
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

PurchaseCoinPage.displayName = 'PurchaseCoinPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const hashId = ctx.query.p || '';
    const paymentApi = createApiClient(PaymentApi, ctx);
    const [allProducts, cards] = await Promise.all([paymentApi.getProducts(), paymentApi.getCards()]);
    const products = allProducts.filter((p) => p.type === 'coin');
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

export default compose([withAuth, withRouter, withTranslation('common')], PurchaseCoinPage);
