import * as React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { Title } from '@components/atoms/Title';
import { TextLabel } from '@components/atoms/Text';
import { withAuth, withAuthServerSideProps } from '@hocs/withAuth';
import { compose } from '@common/utils';
import Image from '@components/atoms/Image';
import Flex from '@components/layouts/Flex';
import { ButtonLink } from '@components/atoms/Button';

const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f7;
  border-radius: 100%;
  margin: 24px auto;
`;

interface MembershipCompleteProps extends WithTranslation {
  router: SingletonRouter;
}

const MembershipCompletePage: NextPage<MembershipCompleteProps> = (props: MembershipCompleteProps) => {
  const { t } = props;

  return (
    <Layout>
      <Head>
        <title>{t('Your membership has been upgraded!')}</title>
      </Head>
      <Container>
        <Title>{t(`Your membership has been upgraded!`)}</Title>

        <ImageContainer>
          <Image width="110px" height="109px" src="/static/images/common/success.svg" />
        </ImageContainer>

        <Flex justifyContent="center" mt={4} mb={6}>
          <TextLabel textAlign="center" fontFamily="secondary">
            {t(`Thank you for upgrading your account. Enjoy Truck2hand.`)}
          </TextLabel>
        </Flex>

        <ButtonLink href="/myaccount/membership">{t('Go to membership')}</ButtonLink>
      </Container>
    </Layout>
  );
};

MembershipCompletePage.displayName = 'MembershipCompletePage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MembershipCompletePage);
