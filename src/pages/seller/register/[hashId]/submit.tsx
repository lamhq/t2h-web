import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { compose } from '@common/utils';
import { withRouter, SingletonRouter } from 'next/router';
import Link from 'next/link';
import { withTranslation } from '@server/i18n';
import { WithTranslation, TFunction } from 'next-i18next';
import { withAuth, RedirectAction, withAuthServerSideProps, useAuthContext } from '@hocs/withAuth';
import Head from 'next/head';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { createApiClient } from '@services/core';
import { SellerApplicationApi } from '@services/apis';
import { SellerApplicationResponse } from '@services/types';
import { getSellerApplication } from '@services/facades/seller-application';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import Box from '@components/layouts/Box';
import Flex from '@components/layouts/Flex';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import Card from '@components/atoms/Card';
import { Title } from '@components/atoms/Title';
import { Button } from '@components/atoms/Button';
import { Text, TextLink } from '@components/atoms/Text';
import Image from '@components/atoms/Image';
import ResponsiveStepper from '@components/organisms/ResponsiveStepper';
import FormHeaderContainer from '@components/layouts/FormHeaderContainer';
import { RadioValueContext } from '@components/molecules/RadioButton';
import RadioGroup, { RadioGroupProps } from '@components/molecules/RadioGroup';
import { ArrowBackIcon, RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from '@components/atoms/IconButton';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { isAjax } from '@common/server';
import { isChrome } from '@common/utils/browser';

const sellerApplicationApi = createApiClient(SellerApplicationApi);

interface SellingTypeCardProps {
  imageSrc: string;
  name: string;
  description: string;
  value: string;
}

const SellingTypeCardContainer = styled(Card)`
  cursor: pointer;
  padding: 10px 12px 9px 8px;
`;

const SellingTypeCard = (props: SellingTypeCardProps) => {
  const { imageSrc, name, description, value } = props;

  const contextValue = React.useContext(RadioValueContext);

  if (!contextValue) {
    throw new Error('RadioGroup Component is missing');
  }

  const isChecked = contextValue.value == value;
  const Icon = isChecked ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    contextValue.onChange(value);
  };

  return (
    <SellingTypeCardContainer p={{ _: 3, md: 4 }} onClick={handleClick}>
      <Flex alignItems="center" flexDirection={{ _: 'row', md: 'column' }}>
        <Image src={imageSrc} alt={name} width={{ _: '60px', md: 'auto' }} height={{ _: 'auto', md: '84px' }} />
        <Flex ml={{ _: '12px', md: 0 }} mt={{ _: 0, md: 2 }} flexDirection="column">
          <Text
            mt={0}
            mb={0}
            fontSize="19px"
            lineHeight="27px"
            letterSpacing="0.09px"
            fontWeight="bold"
            textAlign={{ _: 'left', md: 'center' }}
          >
            {name}
          </Text>
          <Text mt={0} mb={0} variant="small" color="darkGrey" fontFamily="secondary" textAlign={{ _: 'left', md: 'center' }}>
            {description}
          </Text>
        </Flex>
        <Box mt={{ _: 0, md: 2 }} ml="auto" mr={{ _: 0, md: 'auto' }}>
          <Icon />
        </Box>
      </Flex>
    </SellingTypeCardContainer>
  );
};

const SellingTypeRadioGroup = (props: RadioGroupProps & { t: TFunction }) => {
  const { t, ...rest } = props;

  return (
    <RadioGroup flexDirection={{ _: 'column', md: 'row' }} justifyContent="center" {...rest}>
      <Box width={{ _: 1, md: '245px' }} mt={{ _: 3, md: 0 }}>
        <SellingTypeCard
          imageSrc="/static/images/seller/register/irregular-type.png"
          name={t(`End user`)}
          description={t(`Selling personal vehicles that belong to you.`)}
          value="enduser"
        />
      </Box>
      <Box width={{ _: 1, md: '245px' }} mt={{ _: 3, md: 0 }} ml={{ _: 0, md: 3 }}>
        <SellingTypeCard
          imageSrc="/static/images/seller/register/small-business.png"
          name={t(`Agent`)}
          description={t(`Selling vehicles from a registered company name `)}
          value="agent"
        />
      </Box>
    </RadioGroup>
  );
};

interface SellerRegisterSubmitProps extends WithTranslation {
  router: SingletonRouter;
  application?: SellerApplicationResponse;
}

const SellerRegisterSubmit: NextPage<SellerRegisterSubmitProps> = (props: SellerRegisterSubmitProps) => {
  const { t, router, application } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const { handleSubmit, control, getValues, formState } = useForm({
    mode: 'onBlur',
    defaultValues: {
      sellerType: application.sellerType,
    },
  });
  const user = useAuthContext();

  // TODO: Make submit button enabled and disabled depending on form input
  // const buttonPrimary = formState.isValid ? 'primary' : 'disabled'

  const onSubmit = React.useCallback(
    async ({ sellerType }) => {
      try {
        setGlobalSpinner(true);
        await sellerApplicationApi.updateApplication(application.hashId, {
          sellerType,
        });
        await sellerApplicationApi.submitApplication(application.hashId);

        if (user.isMobileVerified) {
          await router.push('/seller/register/waiting-review');
        } else {
          await router.push('/seller/register/request-otp');
        }
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, user.isMobileVerified, setGlobalSnackbar, router, setGlobalSpinner, application],
  );

  return (
    <Layout>
      <Head>
        <title>{t('Seller Registration')}</title>
      </Head>

      <FormHeaderContainer>
        <Box width={{ _: 1, md: '720px' }}>
          <ResponsiveStepper
            currentStep={2}
            title={t(`Seller registration`)}
            steps={[t('Personal details'), t('Bank details'), t('Submit application')]}
          />
        </Box>
      </FormHeaderContainer>

      <Container>
        <Link href="/seller/register/[hashId]/bank" as={`/seller/register/${application.hashId}/bank`}>
          <Flex alignItems="center" mb="15px">
            <ArrowBackIcon size="16px" color="text" />
            <Text my={0} ml="10px" variant="small" fontFamily="secondary">
              {t(`Back to bank details`)}
            </Text>
          </Flex>
        </Link>

        <Title
          mt="24px"
          mb={0}
          fontSize={{ _: 5, md: 6 }}
          lineHeight={{ _: '27px', md: 5 }}
          letterSpacing={4}
          fontWeight="bold"
          color="text"
        >
          {t(`Almost done!`)}
        </Title>

        <Box display={{ _: 'block', md: 'none' }}>
          <Text mt={3} mb={0} color="darkGrey" fontFamily="secondary">
            {t(`Please select the type of seller you want to register as.`)}
          </Text>
        </Box>
        <Box display={{ _: 'none', md: 'block' }}>
          <Text mt={3} mb={0} variant="large" color="darkGrey" fontFamily="secondary" textAlign="center">
            {t(`Tell us what you’re looking to do with your seller account so we can better assist you`)}
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box my={4}>
            <Controller as={SellingTypeRadioGroup} name="sellerType" control={control} defaultValue={getValues('sellerType')} t={t} />
            <FormGroup mt={{ _: '35px', md: '46px' }}>
              <FormControl>
                <Box width={{ _: 1, md: '246px' }} mx={{ _: 0, md: 'auto' }}>
                  <Button variant={formState.isValid ? 'primary' : 'disabled'} type="submit">
                    {t(`Submit`)}
                  </Button>
                </Box>
              </FormControl>
            </FormGroup>
          </Box>
        </form>

        <Box mt="17px" mb={{ _: '50px', md: '44px' }} mx={{ _: 2, md: 'auto' }} width={{ _: 1, md: '334px' }}>
          <Text my={0} textAlign="center" fontFamily="secondary">
            {`${t(`By click continue you agreed to Truck2hand.com's`)} `}
            <TextLink href="/privacy" color="text" fontFamily="secondary" fontWeight="bold">{`${t(`Privacy Policy`)}`}</TextLink>
            {` ${t(`and`)} `}
            <TextLink href="/tos" color="text" fontFamily="secondary" fontWeight="bold">{`${t(`Terms & Conditions`)}`}</TextLink>
          </Text>
        </Box>
      </Container>
    </Layout>
  );
};

SellerRegisterSubmit.displayName = 'SellerRegisterBankInput';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const application = await getSellerApplication(ctx);

    if (!application) {
      const redirect = '/seller/register';

      // Redirect if request is not ajax or the browser is chrome
      if (!isAjax(ctx.req) || isChrome(ctx.req.headers['user-agent'])) {
        ctx.res.writeHead(301, { Location: redirect, 'Cache-Control': 'no-cache, no-store', Pragma: 'no-cache' });
        ctx.res.end();
      }

      return {
        props: { error: { message: 'You are not allowed to access this page', statusCode: 301, redirect } },
      };
    }

    return {
      props: {
        namespacesRequired: ['common'],
        application,
      },
    };
  } catch (err) {
    const statusCode = err.statusCode || 500;

    ctx.res.statusCode = statusCode;

    return {
      props: { error: { message: err.message, statusCode } },
    };
  }
});

export default compose([withAuth, withRouter, withTranslation('common')], SellerRegisterSubmit);
