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

interface PrivacyPageProps extends WithTranslation {}

const PrivacyPage: NextPage<PrivacyPageProps> = (props: PrivacyPageProps) => {
  const { t } = props;
  const privacyIntro =
      'Auto Technic (Thailand) Company Limited (referred to as the "Company") has created this privacy policy in order to establish basic principles for protecting the personal information of customers and users in the electronic commerce business ( e-commerce of the company ("you" or "customer") on the website of the company ("website"). This privacy policy covers the operations of the company Relating to personal information and various information collected by the company In business',
    privacyFirstHeader = '1. Definition of personal information',
    privacyFirstDetail =
      '"Personal information" means information about a person that makes it possible to identify That person, whether directly or indirectly, in accordance with the applicable law';

  return (
    <Layout>
      <Head>
        <title>{t('Privacy Policy')}</title>
      </Head>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={{ _: 0, md: 4 }} mb={{ _: 2, md: 4 }}>
          <Box width={{ _: 1, md: '968px' }}>
            <Title textAlign="left">{t('Privacy Policy')}</Title>
            <Link href="#">Download &quot;Private Policy&quot;</Link>
            <Text style={{ fontWeight: 'bold' }}>{t('Introduction')}</Text>
            <Text>{t(privacyIntro)}</Text>
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{t(privacyFirstHeader)}</Text>
            <Text>{t(privacyFirstDetail)}</Text>
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

PrivacyPage.displayName = 'PrivacyPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], PrivacyPage);
