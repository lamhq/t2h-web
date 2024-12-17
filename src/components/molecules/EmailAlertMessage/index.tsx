import React from 'react';
import AlertMessage from '@components/atoms/AlertMessage';
import { TextLink } from '@components/atoms/Text';
import { withTranslation, WithTranslation } from 'react-i18next';

interface EmailAlertMessageProps extends WithTranslation {
  onResendEmailClick: (e: React.MouseEvent) => void;
}

const EmailAlertMessage: React.FC<EmailAlertMessageProps> = ({ onResendEmailClick, t }: EmailAlertMessageProps) => {
  return (
    <AlertMessage variant="info">
      {t(`Please click the activation link in the email we sent to you.`)}{' '}
      <TextLink color="link" onClick={onResendEmailClick} variant="small">
        {t(`Resend activation email`)}
      </TextLink>
    </AlertMessage>
  );
};

EmailAlertMessage.displayName = 'EmailAlertMessage';

export default withTranslation('common')(EmailAlertMessage);
