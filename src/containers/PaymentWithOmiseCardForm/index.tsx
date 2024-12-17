import React, { useEffect, useCallback } from 'react';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { createJavascriptTag } from '@common/utils';
import { Button, ButtonVariant } from '@components/atoms/Button';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import PaymentApi from '@services/apis/payment';
import { ProductResponse } from '@services/types';

interface PaymentWithOmiseCardFormProps extends WithTranslation {
  omisePublicKey: string;
  paymentApi: ReturnType<typeof PaymentApi>;
  product: ProductResponse;
  recaptcha: string;
  buttonVariant?: ButtonVariant;
  onComplete?: (error?: Error) => void;
}

const PaymentWithOmiseCardForm: React.FC<PaymentWithOmiseCardFormProps> = ({
  paymentApi,
  product,
  omisePublicKey,
  recaptcha,
  buttonVariant,
  onComplete,
  t,
}: PaymentWithOmiseCardFormProps) => {
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!window.OmiseCard || !window.$) {
        return;
      }

      // Sometime omise card dialog is not open...
      if (!window.OmiseCard.app.iframe) {
        window.OmiseCard.app.iframe = document.getElementById('omise-checkout-iframe-app');
        window.OmiseCard.app.iframeLoaded = !!window.OmiseCard.app.iframe;
      }

      const onCreateTokenSuccess = async (cardToken: string) => {
        try {
          setGlobalSpinner(true);

          if (product.paymentType === 'once') {
            const card = await paymentApi.createCard({ cardToken, recaptcha });
            const res = await paymentApi.charge({ card: card.id, productHashId: product.hashId, recaptcha });

            // 3D Secure, redirect to authorize uri
            window.location.href = res.authorizeUri;
          } else {
            const schedules = await paymentApi.getScheduleCharges({ page: 1, active: true });

            if (schedules.length !== 0) {
              // TODO: cancelling existing current and purchase a new one
              throw new Error('You have already subscribed membership. Please cancel current subscription and purchase again.');
            } else {
              // first month/year: charge one time
              // from 2nd month/year: schedule charge
              const card = await paymentApi.createCard({ cardToken, recaptcha });
              const res = await paymentApi.charge({ card: card.id, productHashId: product.hashId, recaptcha });

              // 3D Secure, redirect to authorize uri
              window.location.href = res.authorizeUri;
            }
          }

          onComplete && onComplete();
        } catch (err) {
          setGlobalSnackbar({ message: t(err.message), variant: 'error' });
          onComplete && onComplete(err);
        } finally {
          setGlobalSpinner(false);
        }
      };

      window.OmiseCard.configure({
        publicKey: omisePublicKey,
        onCreateTokenSuccess,
      });
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      window.OmiseCard.open({
        frameLabel: t(product.name).toString(),
        currency: 'THB',
        amount: product.price,
        submitFormTarget: '#add-card-and-pay-form',
        onCreateTokenSuccess,
      });
    },
    [t, setGlobalSpinner, omisePublicKey, paymentApi, product, recaptcha, onComplete, setGlobalSnackbar],
  );

  useEffect(() => {
    const initialize = async () => {
      if (process.browser && !window.OmiseCard) {
        await createJavascriptTag('https://code.jquery.com/jquery-1.12.1.min.js');
        await createJavascriptTag('https://cdn.omise.co/omise.js');
      }
    };

    initialize();
  }, [t, omisePublicKey]);

  return (
    <form id="add-card-and-pay-form" onSubmit={handleSubmit}>
      <Button variant={buttonVariant} type="submit">
        {t('Add a credit card and pay')}
      </Button>
    </form>
  );
};

PaymentWithOmiseCardForm.displayName = 'PaymentWithOmiseCardForm';

PaymentWithOmiseCardForm.defaultProps = {
  buttonVariant: 'primary',
};

export default withTranslation('common')(PaymentWithOmiseCardForm);
