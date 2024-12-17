import React, { useCallback } from 'react';
import Head from 'next/head';
import { withRouter, SingletonRouter } from 'next/router';
import Layout from '@containers/Layout';
import Container from '@components/layouts/Container';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { compose } from '@common/utils';
import { Title } from '@components/atoms/Title';
import IconTextLink from '@components/molecules/IconTextLink';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import { GetServerSideProps } from 'next';
import { withAuth, withAuthServerSideProps, RedirectAction } from '@hocs/withAuth';
import MembershipCancelForm from '@containers/MembershipCancelForm';
import PaymentApi from '@services/apis/payment';
import { createApiClient } from '@services/core';
import { ScheduleChargeArrayResponse } from '@services/types';

const paymentApi = createApiClient(PaymentApi);

interface MembershipCancelPage extends WithTranslation {
  router: SingletonRouter;
  schedules: ScheduleChargeArrayResponse;
}

const MembershipCancelPage: React.FC<MembershipCancelPage> = ({ t, schedules, router }: MembershipCancelPage) => {
  const handleComplete = useCallback(
    (err) => {
      if (err) return;

      // TODO: Show membership cancellation completion dialog
      router.push('/myaccount/membership');
    },
    [router],
  );

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>{t('Membership')}</title>
      </Head>
      <Container>
        <IconTextLink icon={<ArrowBackIcon size="14px" />} onClick={handleClick}>
          {t('Back to memberships')}
        </IconTextLink>
        <Title textAlign="left">{t('Selected package that you want to cancel')}</Title>

        {schedules.map((schedule, idx) => {
          return <MembershipCancelForm key={idx} paymentApi={paymentApi} schedule={schedule} onComplete={handleComplete} />;
        })}
      </Container>
    </Layout>
  );
};

MembershipCancelPage.displayName = 'MembershipCancelPage';

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(RedirectAction.RedirectIfNotAuthenticated)(async (ctx) => {
  try {
    const paymentApi = createApiClient(PaymentApi, ctx);
    const schedules = await paymentApi.getScheduleCharges({ page: 1, active: true });

    return {
      props: {
        namespacesRequired: ['common'],
        schedules,
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

export default compose([withAuth, withRouter, withTranslation('common')], MembershipCancelPage);
