import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { UserApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import { Button } from '@components/atoms/Button';
import { Title } from '@components/atoms/Title';
import Image from '@components/atoms/Image';
import { useAuthContext } from '@hocs/withAuth';
import { Text, TextLink } from '@components/atoms/Text';
import InputOtp from '@components/atoms/InputOtp';

interface InputOtpFormProps extends WithTranslation {
  userApi: ReturnType<typeof UserApi>;
  requestOtpUrl: string;
  onComplete?: (error?: Error) => void;
}

const InputOtpForm: React.FC<InputOtpFormProps> = ({ userApi, requestOtpUrl, onComplete, t }: InputOtpFormProps) => {
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const [otp, setOtp] = React.useState('');
  const user = useAuthContext();

  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setGlobalSpinner(true);
        await userApi.verifyMobile(otp);
        onComplete && onComplete();
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
        onComplete && onComplete(err);
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, otp, setGlobalSpinner, setGlobalSnackbar, userApi, onComplete],
  );

  const onResendOtpClick = React.useCallback(async () => {
    try {
      setGlobalSpinner(true);
      await userApi.sendOtp();
      setGlobalSnackbar({ message: t('We’ve sent you an SMS again') });
    } catch (err) {
      setGlobalSnackbar({ message: t(err.message), variant: 'error' });
    } finally {
      setGlobalSpinner(false);
    }
  }, [t, setGlobalSpinner, setGlobalSnackbar, userApi]);

  return (
    <form onSubmit={handleSubmit}>
      <Flex mt={3} justifyContent="center">
        <Image
          src="/static/images/seller/register/input-otp.svg"
          shape="circle"
          width={{ _: '78px', md: '148px' }}
          height={{ _: '78px', md: '148px' }}
        />
      </Flex>
      <Box width={{ _: 1, md: '330px' }} mx="auto">
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
          {t(`We’ve sent you an SMS`)}
        </Title>

        <Flex mt={3} flexDirection="column" justifyContent="center" alignItems="center">
          <Text my={0} textAlign="center" color="darkGrey" fontFamily="secondary">
            {t(`Please enter the 6 digit OTP code sent to your number`)}
          </Text>
          <Text my={0} ml={2} fontWeight="bold">
            {user.mobile}
          </Text>
        </Flex>

        <Flex mt={{ _: 4, md: 3 }} justifyContent="center">
          <InputOtp codeLength={6} onChange={setOtp} />
        </Flex>

        <Flex mt={3}>
          <Box>
            <TextLink href={requestOtpUrl} my={0} color="link" fontFamily="secondary">
              {t(`Change number`)}
            </TextLink>
          </Box>
          <Box ml="auto" mr={0}>
            <TextLink my={0} color="link" fontFamily="secondary" onClick={onResendOtpClick}>
              {t(`Resend OTP`)}
            </TextLink>
          </Box>
        </Flex>

        <Box mt={4} mb="46px">
          <Button variant="primary">{t(`Continue`)}</Button>
        </Box>
      </Box>
    </form>
  );
};

InputOtpForm.displayName = 'InputOtpForm';

export default withTranslation('common')(InputOtpForm);
