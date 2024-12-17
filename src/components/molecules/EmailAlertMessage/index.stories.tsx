import React from 'react';
import { action } from '@storybook/addon-actions';
import EmailAlertMessage from './index';

export default { title: 'Molecules|EmailAlertMessage' };

export const Messages = () => {
  return <EmailAlertMessage onResendEmailClick={action('onResendEmailClick')} />;
};
