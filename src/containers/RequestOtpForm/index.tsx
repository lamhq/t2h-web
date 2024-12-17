import React from 'react';
import { useForm } from 'react-hook-form';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { UserApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Button } from '@components/atoms/Button';
import { isMobileNumberValid } from '@common/utils/validation';
import Image from '@components/atoms/Image';
import { Title } from '@components/atoms/Title';
import { useAuthContext } from '@hocs/withAuth';
import { Text } from '@components/atoms/Text';
import { InputThaiMobilePhone } from '@components/molecules/InputNumber';

interface RequestOtpFormProps extends WithTranslation {
  userApi: ReturnType<typeof UserApi>;
  recaptcha: string;
  onComplete?: (error?: Error) => void;
}

const RequestOtpForm: React.FC<RequestOtpFormProps> = ({ userApi, recaptcha, onComplete, t }: RequestOtpFormProps) => {
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const user = useAuthContext();

  const { register, errors, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      mobile: user.mobile,
    },
  });

  const onSubmit = React.useCallback(
    async ({ mobile }) => {
      const mobileWithoutSpace = mobile.replace(/ /g, '');

      try {
        setGlobalSpinner(true);
        if (mobileWithoutSpace !== user.mobile) {
          await userApi.updateUser({ mobile: mobileWithoutSpace, recaptcha });
        }

        await userApi.sendOtp();
        onComplete && onComplete();
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
        onComplete && onComplete(err);
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, setGlobalSpinner, user.mobile, recaptcha, userApi, onComplete],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex mt={3} justifyContent="center">
        <Image
          src="/static/images/seller/register/request-otp.svg"
          width={{ _: '78px', md: '148px' }}
          height={{ _: '78px', md: '148px' }}
        />
      </Flex>

      <Box width={{ _: 1, md: '500px' }} mx="auto">
        <Title
          mt={3}
          mb={0}
          textAlign="center"
          fontSize={{ _: 5, md: 6 }}
          lineHeight={{ _: '27px', md: 5 }}
          letterSpacing={4}
          fontWeight="bold"
          color="text"
        >
          {t(`To complete your process please verify your mobile`)}
        </Title>

        <Text mt={3} mb={0} textAlign="center" color="darkGrey" fontFamily="secondary">
          {t(`We will SMS you a code to your primary mobile`)}
        </Text>
      </Box>
      <Box width={{ _: 1, md: '330px' }} mt={{ _: 3, md: 4 }} mb="46px" mx="auto">
        <InputThaiMobilePhone
          ref={register({
            required: { value: true, message: `${t('Mobile')} ${t('is required')}` },
            validate: (value) => {
              if (!isMobileNumberValid(value)) {
                return t('Please input mobile with correct format').toString();
              }

              return true;
            },
          })}
          label={t('Mobile')}
          name="mobile"
          hasError={!!errors.mobile}
          helperText={errors.mobile && t(errors.mobile.message.toString())}
        />

        <Box mt={4}>
          <Button variant={formState.isValid ? 'primary' : 'disabled'} type="submit">
            {t(`Request OTP`)}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

RequestOtpForm.displayName = 'RequestOtpForm';

export default withTranslation('common')(RequestOtpForm);
