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
import { compose } from '@common/utils';
import { FormControl } from '@components/layouts/FormGroup';
import QuestionAndAnswer from '@components/molecules/QuestionAndAnswer';
import Dropdown from '@components/molecules/Dropdown';
import { Button } from '@components/atoms/Button';
import styled from 'styled-components';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';

const Ads = styled.div`
  padding: 16px;
  border-radius: 6px;
  background-color: #1d3461;
  margin-top: 26px;
  color: white;
  text-align: center;
`;

type NavigationItemProps = { active?: boolean };

const NavigationItem = styled.div<NavigationItemProps>`
  padding: 15px;
  font-size: 18px;
  color: ${({ active }) => (active ? '#333' : '#989898')};
  border-left: 2px solid ${({ active }) => (active ? '#222' : '#f3f3f3')};
`;

interface FaqPageProps extends WithTranslation {}

const FaqPage: NextPage<FaqPageProps> = (props: FaqPageProps) => {
  const { t } = props;

  return (
    <Layout>
      <Head>
        <title>{t('Frequently asked questions')}</title>
      </Head>
      <Container>
        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={{ _: 0, md: 4 }} mb={{ _: 2, md: 4 }}>
          <Box width={{ _: 1, md: '968px' }}>
            <Title textAlign="left">{t('Frequently asked questions')}</Title>
          </Box>
        </Flex>

        <Flex flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" mt={{ _: 0, md: 4 }} mb={{ _: 2, md: 4 }}>
          <Box width={{ _: 1, md: '232px' }} mr={{ _: 0, md: 5 }} mb={{ _: 4, md: 0 }} display={{ _: 'none', md: 'block' }}>
            <NavigationItem active>{t('Getting started')}</NavigationItem>
            <NavigationItem>{t('Buying on Truck2Hand')}</NavigationItem>
            <NavigationItem>{t('Selling on Truck2Hand')}</NavigationItem>
            <NavigationItem>{t('Advertising with us')}</NavigationItem>
          </Box>
          <Box width={{ _: 1, md: '704px' }}>
            <FormControl display={{ _: 'block', md: 'none' }}>
              <Dropdown
                options={[
                  { value: 1, label: t('Getting started') },
                  { value: 2, label: t('Buying on Truck2Hand') },
                  { value: 3, label: t('Selling on Truck2Hand') },
                  { value: 4, label: t('Advertising with us') },
                ]}
                onChange={() => true}
              />
            </FormControl>
            <QuestionAndAnswer title="An example of a truck2hand FAQ question">
              <Text my={0} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>

              <Text my={0} mt={4} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </QuestionAndAnswer>

            <QuestionAndAnswer title="What is Truck 2 Hand and how do you get started?">
              <Text my={0} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>

              <Text my={0} mt={4} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </QuestionAndAnswer>

            <QuestionAndAnswer title="An example of a truck2hand FAQ question">
              <Text my={0} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>

              <Text my={0} mt={4} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </QuestionAndAnswer>

            <QuestionAndAnswer title="What is Truck 2 Hand and how do you get started?">
              <Text my={0} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>

              <Text my={0} mt={4} color="darkGrey">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </QuestionAndAnswer>
            <Ads>
              <img src="/static/images/contact.svg" alt="" />
              <Text color="white" fontSize="28px">
                {t('Still need support?')}
              </Text>
              <Text color="white" fontSize="18px">
                {t('Contact us with your questions on our 24/7 support')}
              </Text>
              <Button variant="white" width="170px" display="inline-block">
                {t('Contact us')}
              </Button>
            </Ads>
          </Box>
        </Flex>
      </Container>
    </Layout>
  );
};

FaqPage.displayName = 'FaqPage';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
};

export default compose([withRouter, withTranslation('common')], FaqPage);
