import React from 'react';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { WithTranslation } from 'next-i18next';
import { withTranslation } from '@server/i18n';

interface ErrorProps extends WithTranslation {
  statusCode: number;
}

const Error = ({ statusCode, t }: ErrorProps) => {
  return (
    <Layout>
      <Container>{statusCode ? t(`An error ${statusCode} occurred on server`) : t('An error occurred on client')}</Container>
    </Layout>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

Error.displayName = 'Error';

export default withTranslation('common')(Error);
