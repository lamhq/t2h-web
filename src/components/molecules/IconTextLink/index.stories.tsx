import React from 'react';
import { action } from '@storybook/addon-actions';
import { ArrowBackIcon } from '@components/atoms/IconButton';
import IconTextLink from './index';

export default { title: 'Molecules|IconTextLink' };

export const Standard = () => {
  return <IconTextLink icon={<ArrowBackIcon size="14px" />}>Back to login</IconTextLink>;
};

export const WithAction = () => {
  return (
    <IconTextLink icon={<ArrowBackIcon size="14px" />} onClick={action('clicked')}>
      Back to login
    </IconTextLink>
  );
};
