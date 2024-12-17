import React from 'react';
import { action } from '@storybook/addon-actions';
import FlashMessage from './index';

export default { title: 'Molecules|FlashMessage' };

export const Messages = () => {
  return (
    <React.Fragment>
      <FlashMessage isVisible={true} variant="success" onClose={action('onClose')}>
        You profile has been updated
      </FlashMessage>
      <FlashMessage isVisible={true} variant="info" onClose={action('onClose')}>
        You profile has been updated
      </FlashMessage>
      <FlashMessage isVisible={true} variant="error" onClose={action('onClose')}>
        Some errors happened
      </FlashMessage>
      <FlashMessage isVisible={true} variant="warning" onClose={action('onClose')}>
        Some errors happened
      </FlashMessage>
    </React.Fragment>
  );
};
