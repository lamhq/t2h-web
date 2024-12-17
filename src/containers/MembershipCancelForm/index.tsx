import React, { useCallback } from 'react';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { Button } from '@components/atoms/Button';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import PaymentApi from '@services/apis/payment';
import { ScheduleChargeResponse } from '@services/types';
import Box from '@components/layouts/Box';
import { MembershipSellerProCard, MembershipSellerSilverCard, MembershipSellerGoldCard } from '@components/organisms/MembershipCard';
import { UserMembership } from '@hocs/withAuth';

interface MembershipCancelFormProps extends WithTranslation {
  paymentApi: ReturnType<typeof PaymentApi>;
  schedule: ScheduleChargeResponse;
  onComplete?: (error?: Error) => void;
}

const membershipCardDict: Record<UserMembership, React.ComponentType<any>> = {
  basic: undefined,
  pro: MembershipSellerProCard,
  silver: MembershipSellerSilverCard,
  gold: MembershipSellerGoldCard,
};

const MembershipCancelForm: React.FC<MembershipCancelFormProps> = ({ paymentApi, schedule, onComplete, t }: MembershipCancelFormProps) => {
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  const handleSubmit = useCallback(
    async (e) => {
      try {
        // TODO: Show membership cancellation confirmation dialog
        e.preventDefault();
        setGlobalSpinner(true);

        await paymentApi.deleteScheduleCharge(schedule.id);

        onComplete && onComplete();
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
        onComplete && onComplete(err);
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSpinner, paymentApi, onComplete, schedule, setGlobalSnackbar],
  );

  const product = schedule.charge.metadata.product;
  const membership = product.metadata['membership'];

  if (!membership && membership === 'pro' && membership === 'silver' && membership === 'gold') {
    return undefined;
  }

  // eslint-disable-next-line security/detect-object-injection
  const MembershipCard = membershipCardDict[membership] || MembershipSellerProCard;
  const perLabel = product.paymentType === 'monthly' ? 'month' : 'year';
  const priceLabel = `${product.price / 100} THB / ${t(perLabel)}`;

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <MembershipCard priceLabel={priceLabel} />
      </Box>

      <Box mt={3}>
        <Button variant="primary" type="submit">
          {t('Cancel membership')}
        </Button>
      </Box>
    </form>
  );
};

MembershipCancelForm.displayName = 'MembershipCancelForm';

export default withTranslation('common')(MembershipCancelForm);
