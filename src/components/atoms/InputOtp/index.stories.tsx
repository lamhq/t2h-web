import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import styled from 'styled-components';
import InputOtp from './index';

export default { title: 'Atoms|InputOtp', decorators: [withKnobs] };

const InputOtpWapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const SixDigits = () => (
  <InputOtpWapper>
    <InputOtp codeLength={6} onChange={action('input')} />
  </InputOtpWapper>
);

export const Disabled = () => (
  <InputOtpWapper>
    <InputOtp codeLength={4} disabled={boolean('Disabled', true)} onChange={action('input')} />
  </InputOtpWapper>
);
