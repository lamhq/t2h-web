import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { withRouter, SingletonRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { TFunction } from 'next-i18next';
import styled from 'styled-components';
import { createApiClient } from '@services/core';
import { SellerApplicationApi, MembershipApplicationApi } from '@services/apis';
import { SellerApplicationResponse, ApplicationStatus as SellerApplicationStatus } from '@services/types';
import {
  MembershipApplication,
  MembershipType,
  ApplicationStatus as MembershipApplicationStatus,
} from '@services/apis/membership-application';
import { withAuth, RedirectAction, withAuthServerSideProps } from '@hocs/withAuth';
import { compose, safeKey } from '@common/utils';
import { OuterTitle } from '@components/atoms/Title';
import { AlertMessage, MessageTitle } from '@components/atoms/AlertMessage';
import UpsellCard from '@components/molecules/UpsellCard';
import { CheckCircleOutlineIcon, SyncIcon } from '@components/atoms/IconButton';
import { Tabs, Tab, TabPanel } from '@components/molecules/Tab';
import Box from '@components/layouts/Box';
import { ButtonVariant } from '@components/atoms/Button';
import { TextLink } from '@components/atoms/Text';

const MembershipOrder = {
  [MembershipType.Basic]: 0,
  [MembershipType.Pro]: 1,
  [MembershipType.Silver]: 2,
  [MembershipType.Gold]: 3,
  [MembershipType.Premium]: 4,
};

enum IndicatorType {
  InReview = 'InReview',
  Approved = 'Approved',
  Hidden = 'Hidden',
}

enum TabType {
  Yearly = 0,
  Monthly = 1,
}

const getCardButonProps = (currentMembership: MembershipType, cardMembership: MembershipType, plan: string) => {
  const buttonLink = `/membership/upgrade?membership=${cardMembership}&plan=${plan}`;

  if (MembershipOrder[safeKey(currentMembership)] < MembershipOrder[safeKey(cardMembership)]) {
    return { buttonLink, buttonText: 'Upgrade', buttonVariant: 'success' as ButtonVariant };
  } else {
    return { buttonLink, buttonText: 'Change', buttonVariant: 'warning' as ButtonVariant };
  }
};

interface StatusIndicatorProps {
  t: TFunction;
  type: IndicatorType;
}

const SellerApplicationStatusIndicator = (props: StatusIndicatorProps) => {
  const { t, type } = props;

  if (type === IndicatorType.InReview) {
    return (
      <AlertMessage variant="warning" mt={0}>
        <MessageTitle>
          <SyncIcon color="white" />
          &nbsp;
          <span>{t('In Review')}</span>
        </MessageTitle>
        {t('Your seller application is currently being checked and we’ll let you know soon')}
      </AlertMessage>
    );
  } else if (type === IndicatorType.Approved) {
    return (
      <AlertMessage variant="success" mt={0}>
        <MessageTitle>
          <CheckCircleOutlineIcon color="white" />
          &nbsp;
          <span>{t('Approved')}</span>
        </MessageTitle>
        {t('Your seller application has been approved. You are now a seller. ')}
        <TextLink color="white" variant="medium">
          {t('Get started')}
        </TextLink>
      </AlertMessage>
    );
  }

  return null;
};

const MembershipApplicationStatusIndicator = (props: StatusIndicatorProps & { membership: MembershipType }) => {
  const { t, type, membership } = props;

  if (type === IndicatorType.InReview) {
    return (
      <AlertMessage variant="warning" mt={0}>
        <MessageTitle>
          <SyncIcon color="white" />
          &nbsp;
          <span>{t('In Review')}</span>
        </MessageTitle>
        {t(`We’re currently reviewing your upgrade to ${membership}. We’ll let you know shortly`)}
      </AlertMessage>
    );
  }

  return null;
};

interface MembershipCardProps {
  t: TFunction;
  subTitle?: string;
  buttonLink?: string;
  buttonText: string;
  buttonVariant: ButtonVariant;
}

const BuyerCard = (props: MembershipCardProps) => {
  const { t, buttonLink, buttonText, buttonVariant } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/buyer.svg"
      title={t('Buyer')}
      descriptionItems={[
        t('View all community listings'),
        t('Directly contact sellers & ask product related questions'),
        t('Buy directly from seller without complicated system'),
      ]}
      buttonLink={buttonLink}
      buttonText={t(buttonText)}
      variant={buttonVariant}
    />
  );
};

const SellerCard = (props: MembershipCardProps) => {
  const { t, buttonLink, buttonText, buttonVariant } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-basic.svg"
      title={t('Seller')}
      descriptionItems={[
        <span key={1}>
          {t('Everything in')} <strong>{t('Buyer')}</strong>
        </span>,
        <span key={1}>
          {t('Create exclusive listings on')} <strong>Truck2Hand</strong>
        </span>,
        t('Boost your listings to the top of results'),
      ]}
      buttonLink={buttonLink}
      buttonText={t(buttonText)}
      variant={buttonVariant}
    />
  );
};

const ProCard = (props: MembershipCardProps) => {
  const { t, subTitle, buttonLink, buttonText, buttonVariant } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-pro.svg"
      title={t('Pro')}
      subTitle={subTitle}
      descriptionItems={[
        <span key={0}>
          {t('Everything in')} <strong>{t('Seller basic')}</strong>
        </span>,
        t('Boost your listings'),
        t('Automatic social sharing'),
      ]}
      buttonLink={buttonLink}
      buttonText={t(buttonText)}
      variant={buttonVariant}
    />
  );
};

const SilverCard = (props: MembershipCardProps) => {
  const { t, subTitle, buttonLink, buttonText, buttonVariant } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-silver.svg"
      title={t('Silver')}
      subTitle={subTitle}
      descriptionItems={[
        <span key={0}>
          {t('Everything in')} <strong>{t('Pro')}</strong>
        </span>,
        t('Recommended status'),
        t('Performance tracking'),
      ]}
      buttonLink={buttonLink}
      buttonText={t(buttonText)}
      variant={buttonVariant}
    />
  );
};

const GoldCard = (props: MembershipCardProps) => {
  const { t, subTitle, buttonLink, buttonText, buttonVariant } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-gold.svg"
      title={t('Gold')}
      subTitle={subTitle}
      descriptionItems={[
        <span key={0}>
          {t('Everything in')} <strong>{t('Silver')}</strong>
        </span>,
        t('VIP priority listing exposure'),
        t('Custom store'),
      ]}
      buttonLink={buttonLink}
      buttonText={t(buttonText)}
      variant={buttonVariant}
    />
  );
};

const PremiumCard = (props: MembershipCardProps) => {
  const { t, subTitle, buttonLink, buttonText, buttonVariant } = props;

  return (
    <UpsellCard
      imageUrl="/static/images/membership/seller-gold.svg"
      title={t('Premium')}
      subTitle={subTitle}
      descriptionItems={[
        <span key={0}>
          {t('Everything in')} <strong>{t('Gold')}</strong>
        </span>,
        t('Ad-free shopping experience'),
        t('First to receive features'),
      ]}
      buttonLink={buttonLink}
      buttonText={t(buttonText)}
      variant={buttonVariant}
    />
  );
};

interface CurrentPackageCardProps {
  t: TFunction;
  membership: MembershipType | null;
}

const CurrentPackageCard = (props: CurrentPackageCardProps) => {
  const { t, membership } = props;
  const cardProps = { t, buttonText: 'Current Package', buttonVariant: 'primary' as ButtonVariant };

  switch (membership) {
    case MembershipType.Basic:
      return <SellerCard {...cardProps} />;
    case MembershipType.Pro:
      return <ProCard {...cardProps} />;
    case MembershipType.Silver:
      return <SilverCard {...cardProps} />;
    case MembershipType.Gold:
      return <GoldCard {...cardProps} />;
    case MembershipType.Premium:
      return <PremiumCard {...cardProps} />;
    default:
      return <BuyerCard {...cardProps} />;
  }
};

const CardsContainer = styled.div`
  & > * {
    margin-top: ${({ theme }) => theme.space[4]};
  }
`;

interface PlansProps {
  t: TFunction;
  membership: MembershipType;
}

const YearlyPlans = (props: PlansProps) => {
  const { t, membership } = props;

  return (
    <CardsContainer>
      {membership !== MembershipType.Pro && (
        <ProCard t={t} subTitle={`1,500 THB /${t('year')}`} {...getCardButonProps(membership, MembershipType.Pro, 'year')} />
      )}
      {membership !== MembershipType.Silver && (
        <SilverCard t={t} subTitle={`3,000 THB /${t('year')}`} {...getCardButonProps(membership, MembershipType.Silver, 'year')} />
      )}
      {membership !== MembershipType.Gold && (
        <GoldCard t={t} subTitle={`6,000 THB /${t('year')}`} {...getCardButonProps(membership, MembershipType.Gold, 'year')} />
      )}
      {membership !== MembershipType.Premium && (
        <PremiumCard t={t} subTitle={`12,000 THB /${t('year')}`} {...getCardButonProps(membership, MembershipType.Premium, 'year')} />
      )}
    </CardsContainer>
  );
};

const MonthlyPlans = (props: PlansProps) => {
  const { t, membership } = props;

  //todo: update price
  return (
    <CardsContainer>
      {membership !== MembershipType.Pro && (
        <ProCard t={t} subTitle={`1,500 THB /${t('month')}`} {...getCardButonProps(membership, MembershipType.Pro, 'month')} />
      )}
      {membership !== MembershipType.Silver && (
        <SilverCard t={t} subTitle={`3,000 THB /${t('month')}`} {...getCardButonProps(membership, MembershipType.Silver, 'month')} />
      )}
      {membership !== MembershipType.Gold && (
        <GoldCard t={t} subTitle={`6,000 THB /${t('month')}`} {...getCardButonProps(membership, MembershipType.Gold, 'month')} />
      )}
      {membership !== MembershipType.Premium && (
        <PremiumCard t={t} subTitle={`12,000 THB /${t('month')}`} {...getCardButonProps(membership, MembershipType.Premium, 'month')} />
      )}
    </CardsContainer>
  );
};

interface MembershipIndexPageProps extends WithTranslation {
  router: SingletonRouter;
  membership: MembershipType | null;
  latestSubmittedSellerApplication: SellerApplicationResponse | null;
  latestSubmittedMembershipApplication: MembershipApplication | null;
}

const MembershipIndexPage: NextPage<MembershipIndexPageProps> = (props: MembershipIndexPageProps) => {
  const { t, membership, latestSubmittedSellerApplication, latestSubmittedMembershipApplication } = props;

  let sellerApplicationIndicatorType = IndicatorType.Hidden;
  let membershipApplicationIndicatorType = IndicatorType.Hidden;

  if (membership === MembershipType.Basic) {
    sellerApplicationIndicatorType = IndicatorType.Approved;
  } else if (membership === null && latestSubmittedSellerApplication !== null) {
    sellerApplicationIndicatorType = IndicatorType.InReview;
  }

  if (membership !== null && latestSubmittedMembershipApplication !== null) {
    membershipApplicationIndicatorType = IndicatorType.InReview;
  }

  const [tab, setTab] = React.useState<TabType>(TabType.Yearly);
  const onTabChange = React.useCallback((e: React.ChangeEvent<{}>, newValue: number) => setTab(newValue), [setTab]);

  return (
    <Layout>
      <Head>
        <title>{t('Membership')}</title>
      </Head>
      <OuterTitle fontSize="23px" color="#333" textAlign="left">
        {t('Membership')}
      </OuterTitle>
      <Container>
        {sellerApplicationIndicatorType !== IndicatorType.Hidden && (
          <Box mt="17px">
            <SellerApplicationStatusIndicator t={t} type={sellerApplicationIndicatorType} />
          </Box>
        )}

        <Box mt={5}>
          <CurrentPackageCard t={t} membership={membership} />
        </Box>

        {membership === null && (
          <Box mt={5}>
            <SellerCard t={t} buttonLink={'/seller/register'} buttonText="Upgrade" buttonVariant="success" />
          </Box>
        )}
      </Container>
      {membership !== null && (
        <React.Fragment>
          <OuterTitle fontSize="23px" color="#333" textAlign="left">
            {t('Membership')}
          </OuterTitle>
          <Container>
            {membershipApplicationIndicatorType !== IndicatorType.Hidden && (
              <Box mt={3}>
                <MembershipApplicationStatusIndicator
                  t={t}
                  type={IndicatorType.InReview}
                  membership={latestSubmittedMembershipApplication.membershipType}
                />
              </Box>
            )}
            <Box mt={3}>
              <Tabs value={tab} onChange={onTabChange}>
                <Tab label={t('Yearly')} />
                <Tab label={t('Monthly')} />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <YearlyPlans t={t} membership={membership} />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <MonthlyPlans t={t} membership={membership} />
              </TabPanel>
            </Box>
          </Container>
        </React.Fragment>
      )}
    </Layout>
  );
};

MembershipIndexPage.displayName = 'MembershipIndexPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(
  async (ctx, user) => {
    const membership = user?.membership ?? null;

    const sellerApplicationApi = createApiClient(SellerApplicationApi, ctx);
    const membershipApplicationApi = createApiClient(MembershipApplicationApi, ctx);

    const results = await Promise.allSettled([
      sellerApplicationApi.getApplications({ page: 1, perPage: 10, status: SellerApplicationStatus.Submitted }),
      // TODO: Remove mambership API
      membershipApplicationApi.getApplications(1, 10, MembershipApplicationStatus.Submitted),
    ]);

    let latestSubmittedSellerApplication: SellerApplicationResponse | null = null;
    let latestSubmittedMembershipApplication: MembershipApplication | null = null;

    if (results[0]?.status === 'fulfilled' && results[0].value.length > 0) {
      latestSubmittedSellerApplication = results[0].value[0];
    }

    if (results[1]?.status === 'fulfilled' && results[1].value.length > 0) {
      latestSubmittedMembershipApplication = results[1].value[0];
    }

    return {
      props: {
        namespacesRequired: ['common'],
        membership: membership,
        latestSubmittedSellerApplication,
        latestSubmittedMembershipApplication,
      },
    };
  },
);

export default compose([withAuth, withRouter, withTranslation('common')], MembershipIndexPage);
