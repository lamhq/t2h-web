import React from 'react';
import { NextPage } from 'next';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';

const Error404: NextPage<WithTranslation> = ({ t }: WithTranslation) => {
  return (
    <Layout>
      <Container>{t('Page Not Found')}</Container>
    </Layout>
  );
};

Error404.displayName = 'Error404';

export default withTranslation('common')(Error404);
