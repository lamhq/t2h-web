import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import Head from 'next/head';
import styled from 'styled-components';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { Title, SubTitle } from '@components/atoms/Title';
import { ButtonLink } from '@components/atoms/Button';
import { Text } from '@components/atoms/Text';
import Image from '@components/atoms/Image';
import ExplanationCard from '@components/molecules/ExplanationCard';

interface SellerRegisterIndexProps extends WithTranslation {
  router: SingletonRouter;
}

const Feature = (props: { imageSrc: string; description: string; imageWidth: any }) => {
  const { imageSrc, description, imageWidth } = props;

  return (
    <Flex
      height={{ _: 'auto', md: '140px' }}
      alignItems={{ _: 'center', md: 'center' }}
      justifyContent={{ _: 'space-between', md: 'stretch' }}
      flexDirection={{ _: 'row', md: 'column' }}
    >
      <Box my={{ _: 0, md: 'auto' }} width={imageWidth}>
        <Image src={imageSrc} width={imageWidth} />
      </Box>
      <Box my={0} ml="auto" mr={0} mt={{ _: 0, md: 'auto' }} width="168px">
        <Text my={0} color="inputText" fontFamily="secondary" fontWeight="bold" textAlign={{ _: 'left', md: 'center' }}>
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

const UL = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    &:before {
      content: '•';
      margin-right: 0.5em;
    }
    &:not(:first-child) {
      margin-top: 14px;
    }

    p {
      display: inline;
    }
  }
`;

const REASONS = [
  'Our website get more than 400k user per month, so our website has lot of buyers in our website',
  'We have SNS channel such as Facebook with 190k+ followers and and Line with 31k+ friends',
  'Truck’s owner can post themselves without broker',
  'Buy-sell easily, buyers-sellers contact directly.',
  'Seller can show truck images and details for initial decision',
  'We believe that if seller select our service to selling your product, seller can reach to real end user which means you have opportunity to sell your product as higher price, because you can skip broker.',
];

const SellerRegisterIndex: NextPage<SellerRegisterIndexProps> = (props: SellerRegisterIndexProps) => {
  const { t } = props;

  return (
    <Layout>
      <Head>
        <title>{t('Seller Registration')}</title>
      </Head>
      <Container>
        <Box mx="39px">
          <Title
            my={0}
            textAlign="center"
            fontSize={{ _: '28px', md: '52px' }}
            lineHeight={{ _: '37px', md: '68px' }}
            letterSpacing={{ _: '0.1px', md: '0.2px' }}
            color="text"
            fontWeight="bold"
          >
            {t(`Start selling for free today!`)}
          </Title>
        </Box>
        <Box mt={{ _: '12px', md: 2 }} mx={{ _: '13px', md: 0 }}>
          <SubTitle
            my={0}
            textAlign="center"
            fontSize={{ _: '19px', md: '22px' }}
            lineHeight="27px"
            letterSpacing={{ _: '0.09px', md: '0.1' }}
            color="text"
            fontWeight="bold"
          >
            {t(`Enjoy the benefits of selling with Truck2Hand.`)}
          </SubTitle>
        </Box>

        <Flex mt={{ _: '23px', md: 3 }} justifyContent="center">
          <Box width={{ _: '100%', md: '328px' }}>
            <ButtonLink
              href="/seller/register/personal"
              variant="secondary"
              borderRadius="19px"
              fontSize="16px"
              lineHeight="22px"
              letterSpacing="0.08px"
              fontFamily="secondary"
            >
              {t(`Upgrade to seller`)}
            </ButtonLink>
          </Box>
        </Flex>

        <Box mt={{ _: '51px', md: '71px' }} mx={{ _: 'auto', md: 0 }}>
          <Flex
            mx="auto"
            width={{ _: '300px', md: '770px' }}
            flexDirection={{ _: 'column', md: 'row' }}
            justifyContent={{ _: '', md: 'space-between' }}
          >
            <Box>
              <Feature
                imageSrc="/static/images/seller/register/truck.svg"
                imageWidth={{ _: '69px', md: '110px' }}
                description={t(`Thailands largest second hand dealer!`)}
              />
            </Box>
            <Box mt={{ _: 5, md: 0 }}>
              <Feature
                imageSrc="/static/images/seller/register/buyer.svg"
                imageWidth={{ _: '53px', md: '83px' }}
                description={t(`buy and sell easily without brokers`)}
              />
            </Box>
            <Box mt={{ _: 5, md: 0 }}>
              <Feature
                imageSrc="/static/images/seller/register/social-media.png"
                imageWidth={{ _: '63px', md: '90px' }}
                description={t(`Connected to a social media audience`)}
              />
            </Box>
          </Flex>
        </Box>

        <Box mt={{ _: '51px', md: '89px' }}>
          <SubTitle
            mt={0}
            mb={0}
            textAlign="center"
            fontSize={{ _: '19px', md: 6 }}
            lineHeight={{ _: '27px', md: 5 }}
            letterSpacing={{ _: 3, md: 4 }}
            color="text"
            fontWeight="bold"
          >
            {t(`Get started in 2 easy steps!`)}
          </SubTitle>
        </Box>
        <Box mt={{ _: '26px', md: '34px' }}>
          <Box>
            <ExplanationCard
              icon={<Image width={{ _: '74px', md: '170px' }} src="/static/images/seller/register/identification.svg" />}
              title={t(`1. Proof of Identification`)}
              items={[t(`Thai National ID`), t(`Picture of your ID Card`), t(`Selfie with your ID card`)]}
            />
          </Box>
          <Box mt={{ _: '26px', md: '39px' }}>
            <ExplanationCard
              icon={<Image width={{ _: '94px', md: '170px' }} src="/static/images/seller/register/bank-details.svg" />}
              title={t(`2. Bank details`)}
              items={[t(`Bank account number`), t(`Picture of Book Bank`)]}
            />
          </Box>
        </Box>

        <Box mt={{ _: 0, md: '28px' }} display={{ _: 'none', md: 'block' }}>
          <Text mt={0} mb={0} textAlign="center">
            {t(`* Companies need to submit a copy of the company registration document`)}
          </Text>
        </Box>

        <Box mt="26px" mb={{ _: '49px', md: '125px' }} mx="auto" width={{ _: 1, md: '328px' }}>
          <ButtonLink
            href="/seller/register/personal"
            variant="secondary"
            borderRadius="19px"
            fontSize="16px"
            lineHeight="22px"
            letterSpacing="0.08px"
            fontFamily="secondary"
          >
            {t(`Upgrade to seller`)}
          </ButtonLink>
        </Box>
      </Container>

      <Box pt={{ _: '37px', md: '53px' }} pb={{ _: '43px', md: '86px' }} px={{ _: 3, md: 0 }} backgroundColor="#f6f6f6">
        <Box width={{ _: '100%', md: '672px' }} mx="auto">
          <SubTitle mt={0} mb={0} textAlign="left" fontSize="23px" lineHeight="27px" letterSpacing="0.1px" color="text" fontWeight="bold">
            {t(`Why should I sign up as a seller?`)}
          </SubTitle>
          <Box mt={4} width="100%">
            <UL>
              {REASONS.map((reason, index) => {
                return (
                  <li key={index}>
                    <Text variant="small" color="inputText" fontFamily="secondary">
                      {t(reason)}
                    </Text>
                  </li>
                );
              })}
            </UL>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

SellerRegisterIndex.displayName = 'SellerRegisterIndexPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async () => {
  return {
    props: {
      namespacesRequired: ['common'],
    },
  };
});

export default compose([withAuth, withRouter, withTranslation('common')], SellerRegisterIndex);
