import React, { useState, useCallback } from 'react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';
import { InputThaiMobilePhone, InputThaiBankAccount } from './index';

export default { title: 'Molecules|InputNumber' };

const Container = styled.div`
  padding: 20px;
`;

export const PhoneInput = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
    action('Changed')(e.target.value);
  }, []);

  return (
    <Container>
      <InputThaiMobilePhone placeholder="Phone number" label="Phone number" value={text} onChange={handleChange} />
      <p>Latest value from onChange: {text}</p>
    </Container>
  );
};

export const BankInput = () => {
  const [text, setText] = useState('');

  const handleChange = useCallback((e) => {
    setText(e.target.value);
    action('Changed')(e.target.value);
  }, []);

  return (
    <Container>
      <InputThaiBankAccount placeholder="Bank account number" label="Bank account number" value={text} onChange={handleChange} />
      <p>Latest value from onChange: {text}</p>
    </Container>
  );
};
