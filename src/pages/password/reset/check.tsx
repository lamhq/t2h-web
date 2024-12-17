import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { withRouter, SingletonRouter } from 'next/router';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { Title } from '@components/atoms/Title';
import { Text } from '@components/atoms/Text';
import { compose } from '@common/utils';
import { withAuth, withAuthServerSideProps, RedirectAction } from '@hocs/withAuth';
import IconTextLink from '@components/molecules/IconTextLink';
import Image from '@components/atoms/Image';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import styled from 'styled-components';

interface PasswordResetCheckPageProps extends WithTranslation {
  router: SingletonRouter;
}

const ImageContainer = styled.div`
  width: 188px;
  height: 187px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f7;
  border-radius: 100%;
  margin: 24px auto;
`;

const PasswordResetCheckPage: NextPage<PasswordResetCheckPageProps> = (props: PasswordResetCheckPageProps) => {
  const { t /*, router */ } = props;

  return (
    <Layout>
      <Container>
        <Link href="/signin">
          <IconTextLink icon={<ArrowBackIcon size="14px" />}>{t('Back to login')}</IconTextLink>
        </Link>
        <ImageContainer>
          <Image width="110px" height="109px" src="/static/images/common/check-email.svg" />
        </ImageContainer>
        <Title>{t('Check your inbox')}</Title>
        <Text textAlign="center">{t("We've sent you an email with instructions to reset your password")}</Text>
        <Text textAlign="center" variant="small" color="#989898">
          ({t('The reset link will expires in 24h')})
        </Text>
      </Container>
    </Layout>
  );
};

PasswordResetCheckPage.displayName = 'PasswordResetCheckPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], PasswordResetCheckPage);
