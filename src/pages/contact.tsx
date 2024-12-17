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
import { SubTitle } from '@components/atoms/Title';
import Flex from '@components/layouts/Flex';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import InputText from '@components/molecules/InputText';
import InputLabel from '@components/atoms/InputLabel';
import Dropdown from '@components/molecules/Dropdown';
import TextArea from '@components/molecules/TextArea';
import { Button } from '@components/atoms/Button';
import { LocationOnOutlinedIcon, PhoneIcon, MailOutlineIcon } from '@components/atoms/IconButton';
import styled from 'styled-components';
import { COMPANY_PHONE, COMPANY_EMAIL, COMPANY_ADDRESS } from '@constants/contact';
import Box from '@components/layouts/Box';

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

interface ContactPageProps extends WithTranslation {}

const ContactPage: NextPage<ContactPageProps> = (props: ContactPageProps) => {
  const { t } = props;

  return (
    <Layout>
      <Head>
        <title>{t('Contact us')}</title>
      </Head>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={{ _: 0, md: 4 }} mb={{ _: 2, md: 4 }}>
          <Box width={{ _: 1, md: '968px' }}>
            <Title textAlign="left">{t('Contact us')}</Title>
            <Text>
              {t(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              )}
            </Text>
          </Box>
        </Flex>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center">
          <Box width={{ _: 1, md: '468px' }} mr={{ _: 0, md: 5 }} mb={{ _: 4, md: 0 }}>
            <SubTitle textAlign="left">{t('Contact form')}</SubTitle>
            <FormGroup mt={0}>
              <FormControl>
                <InputText type="text" value={''} label={t('Name')} onChange={() => true} />
              </FormControl>
            </FormGroup>
            <FormGroup mt={0}>
              <FormControl>
                <InputText type="text" value={''} label={t('Email')} onChange={() => true} />
              </FormControl>
            </FormGroup>
            <FormControl>
              <InputLabel>{t('Contact purpose')}</InputLabel>
              <Dropdown
                options={[
                  { value: null, label: t('- Please select -') },
                  { value: 1, label: t('Option 1') },
                  { value: 2, label: t('Option 2') },
                  { value: 3, label: t('Option 3') },
                ]}
                onChange={() => true}
              />
            </FormControl>
            <FormControl>
              <TextArea rows={4} minRows={4} maxRows={10} label={t('Message')} />
            </FormControl>

            <FormGroup>
              <FormControl>
                <Button>{t('Send message')}</Button>
              </FormControl>
            </FormGroup>
          </Box>
          <Box width={{ _: 1, md: '468px' }}>
            <SubTitle mt="40px" textAlign="left">
              {t('Address details')}
            </SubTitle>
            <Flex>
              <LocationOnOutlinedIcon size="20px" />
              <Text ml="10px" mt={0}>
                {COMPANY_ADDRESS}
              </Text>
            </Flex>
            <Flex>
              <PhoneIcon size="20px" />
              <Text ml="10px" mt={0}>
                {COMPANY_PHONE}
              </Text>
            </Flex>
            <Flex>
              <MailOutlineIcon size="20px" />
              <Text ml="10px" mt={0}>
                {COMPANY_EMAIL}
              </Text>
            </Flex>
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

ContactPage.displayName = 'ContactPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps()(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], ContactPage);
