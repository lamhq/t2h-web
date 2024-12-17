import React, { useCallback } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { UserApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import EmailAlertMessage from '@components/molecules/EmailAlertMessage';

interface EmailVerificaitionAlertMessageProps extends WithTranslation {
  userApi: ReturnType<typeof UserApi>;
  onComplete?: (error?: Error) => void;
}

const EmailVerificaitionAlertMessage: React.FC<EmailVerificaitionAlertMessageProps> = ({
  userApi,
  onComplete,
  t,
}: EmailVerificaitionAlertMessageProps) => {
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();

  const handleResendEmailClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        setGlobalSpinner(true);
        await userApi.sendVerificaitionEmail();
        setGlobalSnackbar({ message: t("We've sent you a verification email"), variant: 'success' });
        onComplete && onComplete();
      } catch (err) {
        setGlobalSnackbar({ message: t(err.message), variant: 'error' });
        onComplete && onComplete(err);
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, setGlobalSnackbar, setGlobalSpinner, userApi, onComplete],
  );

  return <EmailAlertMessage onResendEmailClick={handleResendEmailClick} />;
};

EmailVerificaitionAlertMessage.displayName = 'EmailVerificaitionAlertMessage';

export default withTranslation('common')(EmailVerificaitionAlertMessage);
