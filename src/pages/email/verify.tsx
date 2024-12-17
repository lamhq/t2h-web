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
import { createApiClient } from '@services/core';
import { UserApi } from '@services/apis';
import { ButtonLink } from '@components/atoms/Button';
import { ApiError } from '@services/types';
import { isAjax } from '@common/server';
import { isChrome } from '@common/utils/browser';

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

interface IndexPageProps extends WithTranslation {
  router: SingletonRouter;
}

const IndexPage: NextPage<IndexPageProps> = (props: IndexPageProps) => {
  const { t } = props;

  return (
    <Layout>
      <Head>
        <title>{t('Your email has been verified')}</title>
      </Head>
      <Container>
        <Title>{t(`Your email has been verified!`)}</Title>

        <ImageContainer>
          <Image width="110px" height="109px" src="/static/images/common/success.svg" />
        </ImageContainer>

        <Flex justifyContent="center" mt={4} mb={6}>
          <TextLabel textAlign="center" fontFamily="secondary">
            {t(`Thank you for using Truck2hand. Your account has been successfully activated.`)}
          </TextLabel>
        </Flex>

        <ButtonLink href="/">{t('Go to home')}</ButtonLink>
      </Container>
    </Layout>
  );
};

IndexPage.displayName = 'IndexPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async (ctx) => {
  const userApi = createApiClient(UserApi, ctx);

  try {
    const verificationToken = ctx.query?.verification_token;

    if (typeof verificationToken !== 'string') {
      throw new ApiError({ message: 'invalid verification token', error: 'invalid_verification_token', statusCode: 400 });
    }

    await userApi.verifyEmail(verificationToken);

    return {
      props: {
        namespacesRequired: ['common'],
      },
    };
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const redirect = '/';

    // Redirect if request is not ajax or the browser is chrome
    if (!isAjax(ctx.req) || isChrome(ctx.req.headers['user-agent'])) {
      ctx.res.writeHead(301, { Location: redirect, 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' });
      ctx.res.end();
    }

    return {
      props: { error: { message: err.message, statusCode, redirect } },
    };
  }
});

export default compose([withAuth, withRouter, withTranslation('common')], IndexPage);
