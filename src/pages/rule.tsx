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

interface RulePageProps extends WithTranslation {}

const RulePage: NextPage<RulePageProps> = (props: RulePageProps) => {
  const { t } = props;
  const ruleFirstHeader = '1. Prohibited goods list',
    ruleFirstPara1 =
      "The company prohibits posting or selling products on the list of prohibited products. If the seller posts products on the prohibited list Will be considered a violation of the terms of use whether the seller intentionally or not If the company considers that the item listing violates the conditions Or inappropriate The company may consider using the company's discretion to withdraw the post and cancel, withdraw or suspend related transactions.",
    ruleFirstPara2 =
      'In general, the company is not involved in goods, services, transactions or activities that have the following characteristics.',
    ruleBullet1 = 'Violate government laws or regulations or support or encourage third parties to do so',
    ruleBullet2 = 'Cheating, deceiving, unfair behavior or destroying others';

  return (
    <Layout>
      <Head>
        <title>{t('Rule')}</title>
      </Head>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={{ _: 0, md: 4 }} mb={{ _: 2, md: 4 }}>
          <Box width={{ _: 1, md: '968px' }}>
            <Title textAlign="left">{t('Rule')}</Title>
            <Link href="#">Download &quot;Rule&quot;</Link>
            <Text style={{ fontWeight: 'bold' }}>{t('Introduction')}</Text>
            <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{t(ruleFirstHeader)}</Text>
            <Text>{t(ruleFirstPara1)}</Text>
            <Text>{t(ruleFirstPara2)}</Text>
            <ul>
              <li>
                <Text>{t(ruleBullet1)}</Text>
              </li>
              <li>
                <Text>{t(ruleBullet2)}</Text>
              </li>
            </ul>
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

RulePage.displayName = 'RulePage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], RulePage);
