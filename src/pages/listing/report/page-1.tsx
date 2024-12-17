import React from 'react';
import Head from 'next/head';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import Dialog from '@components/molecules/Dialog';
import { Button } from '@components/atoms/Button';
import { Text, TextLink } from '@components/atoms/Text';
import Flex from '@components/layouts/Flex';

const Page1: React.FC<WithTranslation> = ({ t }: WithTranslation) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  }, []);

  const onClose = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  const onActionButtonClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  return (
    <Layout>
      <Head>
        <title>{t('Report listing')}</title>
      </Head>
      <Container>
        <Button onClick={onButtonClick}>{t('Report listing')}</Button>
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          showsTitle={true}
          showsCloseIcon={false}
          showsActionButton={false}
          title={t('Report listing')}
        >
          <Text>{t('If there is an issue with this listing, please select the appropriate reporting option.')}</Text>
          <Text>
            <TextLink variant="medium">{t('Content related issue')}</TextLink>
          </Text>
          <Text>
            <TextLink variant="medium">{t('Fraudulent listing')}</TextLink>
          </Text>
          <Text>
            <TextLink variant="medium">{t('Copyright claim')}</TextLink>
          </Text>
          <Text>
            <TextLink variant="medium">{t('Other, not listed')}</TextLink>
          </Text>
          <Flex justifyContent="center" mt="27px">
            <Button variant="transparent" onClick={onActionButtonClick}>
              {t('Cancel')}
            </Button>
          </Flex>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default compose([withTranslation('common')], Page1);
