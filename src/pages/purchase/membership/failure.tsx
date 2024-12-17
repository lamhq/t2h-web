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
import { TextLabel, TextLink } from '@components/atoms/Text';
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

interface MembershipFailureProps extends WithTranslation {
  router: SingletonRouter;
}

const MembershipFailurePage: NextPage<MembershipFailureProps> = (props: MembershipFailureProps) => {
  const { t } = props;

  return (
    <Layout>
      <Head>
        <title>{t('Your membership upgrading has been failed')}</title>
      </Head>
      <Container>
        <Title>{t(`Your membership upgrading has been failed.`)}</Title>

        <ImageContainer>
          <Image width="110px" height="109px" src="/static/images/common/failure.svg" />
        </ImageContainer>

        <Flex justifyContent="center" mt={4} mb={6}>
          <TextLabel textAlign="center" fontFamily="secondary">
            {t('Your membership upgrading has been failed. Please go to ')}
            <TextLink variant="medium" href="/faq">
              {t('help center')}
            </TextLink>
            {t(', if you need help.')}
          </TextLabel>
        </Flex>

        <ButtonLink href="/myaccount/membership">{t('Back to membership')}</ButtonLink>
      </Container>
    </Layout>
  );
};

MembershipFailurePage.displayName = 'MembershipFailurePage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], MembershipFailurePage);
