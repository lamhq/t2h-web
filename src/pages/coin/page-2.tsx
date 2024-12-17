import React from 'react';
import Head from 'next/head';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { Title } from '@components/atoms/Title';
import { OuterTitle } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import IconTextLink from '@components/molecules/IconTextLink';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import CoinMenuItem from '@components/molecules/CoinMenuItem';

const Page2: React.FC<WithTranslation> = ({ t }: WithTranslation) => {
  return (
    <Layout>
      <Head>
        <title>{t('Purchase coins')}</title>
      </Head>
      <OuterTitle fontSize="19px" color="darkGrey" textAlign="left">
        {t('Purchase coins')}
      </OuterTitle>
      <Container>
        <IconTextLink icon={<ArrowBackIcon size="14px" />}>{t('Back to Coins')}</IconTextLink>
        <Title textAlign="left">{t('Your purchase')}</Title>
        <CoinMenuItem amount="25 coins" description="1 boost" price="100 THB" />
        <Text variant="mediumLarge" mt={4}>
          {t('Please select payment option')}
        </Text>
        <img src="/static/images/current-payment.png" alt="" />
        <br />
        <img src="/static/images/payment-options.png" alt="" />
      </Container>
    </Layout>
  );
};

export default compose([withTranslation('common')], Page2);
