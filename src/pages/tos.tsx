/* eslint-disable no-restricted-imports */
import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { withRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { Text } from '@components/atoms/Text';
import { Title } from '@components/atoms/Title';
import { withAuth, withAuthServerSideProps } from '@hocs/withAuth';
import { compose } from '@common/utils';
import Flex from '@components/layouts/Flex';
import { Button } from '@components/atoms/Button';
import styled from 'styled-components';
import Box from '@components/layouts/Box';
import Link from 'next/link';

const Ads = styled.div`
  padding: 26px;
  border-radius: 8px;
  background-color: #1d3461;
  margin-top: 30px;
  position: relative;
  overflow: hidden;
`;

const Decorator = styled.div`
  width: 0;
  height: 0;
  border-right: 60px solid #ff3c35;
  border-top: 200px solid transparent;
  position: absolute;
  right: 0;
  bottom: 0;
`;

interface TermsOfServicePageProps extends WithTranslation {}

const TermsOfServicePage: NextPage<TermsOfServicePageProps> = (props: TermsOfServicePageProps) => {
  const { t } = props;
  const tosIntro =
      'This Terms of Use ("Conditions") sets out the terms and conditions of service. (As further stated) and rights and obligations between us / company and users. You must agree to the terms by reading all content before using the service.',
    tosFirstHeader = '1. Scope and details of the service',
    tosFirstDetail =
      '1) Service (as stated herein) is an online marketplace service in the form of "consumer-to-consumer" or "business-to-business owner" ("business owner-to-business owner") or " Business-to-customer "(" business owner-to-customer "). We do not offer business accounts. And we do not sell or buy products or take possession of the products either for themselves or on behalf of users or others While we will assist in the transaction The user who posts the product through the service and the user who purchases the product through the service (the "buyer") is responsible for the sale and quality of the product. (Hereinafter referred to as "goods", "products", "goods" or "goods") Including but not limited to List of products and the warranty of that product';

  return (
    <Layout>
      <Head>
        <title>{t('Terms and Conditions of use')}</title>
      </Head>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={{ _: 0, md: 4 }} mb={{ _: 2, md: 4 }}>
          <Box width={{ _: 1, md: '968px' }}>
            <Title textAlign="left">{t('Terms and Conditions of Use')}</Title>
            <Link href="#">Download &quot;Terms and Conditions of Use&quot;</Link>
            <Text style={{ fontWeight: 'bold' }}>{t('Introduction')}</Text>
            <Text>{t(tosIntro)}</Text>
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{t(tosFirstHeader)}</Text>
            <Text>{t(tosFirstDetail)}</Text>
          </Box>
        </Flex>

        <Ads>
          <Text color="white" fontSize={6} fontWeight="bold" lineHeight="37px" mt={0}>
            {t('Register today to start buying and selling vehicles')}
          </Text>
          <Button width="174px" variant="contact">
            {t('REGISTER NOW')}
          </Button>
          <Decorator />
        </Ads>
      </Container>
    </Layout>
  );
};

TermsOfServicePage.displayName = 'TermsOfServicePage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], TermsOfServicePage);
