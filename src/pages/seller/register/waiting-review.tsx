import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Flex from '@components/layouts/Flex';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import Image from '@components/atoms/Image';
import Box from '@components/layouts/Box';

interface SellerRegisterWaitingReviewProps extends WithTranslation {
  router: SingletonRouter;
}

const SellerRegisterWaitingReview: NextPage<SellerRegisterWaitingReviewProps> = (props: SellerRegisterWaitingReviewProps) => {
  const { t } = props;

  return (
    <Layout>
      <Head>
        <title>{t('Seller Registration')}</title>
      </Head>
      <Container>
        <Flex mb="138px" flexDirection="column" alignItems="center">
          <Image src="/static/images/seller/register/waiting-review.png" alt="waiting-review" width="150px" height="150px" />
          <Title my={0} mt="20px" textAlign="center" fontSize={{ _: 5, md: 7 }} letterSpacing={5} lineHeight={{ _: '27px', md: '42px' }}>
            {t(`Thank you, your application is in review`)}
          </Title>
          <Box width={{ _: 1, md: '350px' }} mx="auto">
            <Text my={0} mt={{ _: '20px', md: '28px' }} textAlign="center" color="darkGrey">
              {t(`We’re currently reviewing your application and will notify you as soon as we can.`)}
            </Text>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

SellerRegisterWaitingReview.displayName = 'SellerRegisterWaitingReview';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SellerRegisterWaitingReview);
