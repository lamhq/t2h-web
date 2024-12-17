import React from 'react';
import Head from 'next/head';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import Separator from '@components/atoms/Separator';
import Stepper from '@components/molecules/Stepper';
import IconTextLink from '@components/molecules/IconTextLink';
import { ArrowBackIcon } from '@components/atoms/IconButton';

const Page4: React.FC<WithTranslation> = ({ t }: WithTranslation) => {
  return (
    <Layout>
      <Head>
        <title>{t('Membership')}</title>
      </Head>
      <Stepper formName={t('Upgrade membership')} stepName={t('Payment')} currentStep={2} numOfSteps={2} />
      <Container>
        <IconTextLink icon={<ArrowBackIcon size="14px" />}>{t('Back to Personal details')}</IconTextLink>
        <Title textAlign="left">Your purchase</Title>
        <Separator borderBottomColor="#f3f3f3" height="2px" />
        <Text my={2}>{t('Pro membership upgrade')}</Text>
        <Text my={2}>1,500THB</Text>
        <Separator borderBottomColor="#f3f3f3" height="2px" />
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

export default compose([withTranslation('common')], Page4);
