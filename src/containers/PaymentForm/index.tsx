import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { Button, ButtonVariant } from '@components/atoms/Button';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import PaymentApi from '@services/apis/payment';
import { CardArrayResponse, ProductResponse } from '@services/types';
import Box from '@components/layouts/Box';
import { Text } from '@components/atoms/Text';
import RichRadioButton from '@components/organisms/RichRadioButton';
import RadioGroup from '@components/molecules/RadioGroup';
import Flex from '@components/layouts/Flex';
import { zeroPadding } from '@common/utils';
import CheckBox from '@components/molecules/CheckBox';

interface PaymentFormProps extends WithTranslation {
  paymentApi: ReturnType<typeof PaymentApi>;
  cards: CardArrayResponse;
  product: ProductResponse;
  recaptcha: string;
  buttonVariant?: ButtonVariant;
  onComplete?: (error?: Error) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentApi,
  product,
  cards,
  recaptcha,
  buttonVariant,
  onComplete,
  t,
}: PaymentFormProps) => {
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const defaultCard = cards.length > 0 ? cards[0].id : undefined;
  const { control, handleSubmit, formState } = useForm<{ card: string; agreed: boolean }>({
    mode: 'onChange',
    defaultValues: {
      card: defaultCard,
      agreed: false,
    },
  });

  const onSubmit = useCallback(
    async ({ card, agreed }) => {
      try {
        if (!agreed) {
          throw new Error('Please click agree button');
        }

        setGlobalSpinner(true);

        if (product.paymentType === 'once') {
          const res = await paymentApi.charge({ card, productHashId: product.hashId, recaptcha });

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
            const res = await paymentApi.charge({ card, productHashId: product.hashId, recaptcha });

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
    },
    [t, setGlobalSpinner, paymentApi, onComplete, product, recaptcha, setGlobalSnackbar],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          as={
            <RadioGroup flexDirection="column">
              {cards.map((card, idx) => (
                <Box key={idx} mt={idx === 0 ? 0 : 2}>
                  <RichRadioButton value={card.id} selectedBackgroundColor="boost" selectedFontColor="white" height="60px">
                    <Flex width="100%" ml={2} flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Flex flexDirection="column">
                        <Box>{`${card.name}`}</Box>
                        <Box>{`${card.brand} ${card.lastDigits}`}</Box>
                      </Flex>
                      <Text ml="auto" my={0} color="inherit" textAlign="right" lineHeight="16px">
                        {t('EXP')} {`${zeroPadding(card.expirationMonth, 2)}/${String(card.expirationYear).slice(2, 4)}`}
                      </Text>
                    </Flex>
                  </RichRadioButton>
                </Box>
              ))}
            </RadioGroup>
          }
          name="card"
          control={control}
          rules={{ required: true }}
          defaultValue={defaultCard}
          onChange={(changes) => {
            return changes.length > 0 ? changes[0] : undefined;
          }}
        />
      </Box>

      <Box mt={3}>
        <Controller
          as={<CheckBox name="agreed" label={t('Agree to place an order')} />}
          name="agreed"
          control={control}
          rules={{ required: true }}
          onChange={(changes) => {
            return changes.length > 0 ? changes[0] : undefined;
          }}
        />
      </Box>

      <Box mt={3}>
        <Button variant={formState.isValid ? buttonVariant : 'disabled'} type="submit">
          {t('Place an order')}
        </Button>
      </Box>
    </form>
  );
};

PaymentForm.displayName = 'PaymentForm';

PaymentForm.defaultProps = {
  buttonVariant: 'primary',
};

export default withTranslation('common')(PaymentForm);
