import React from 'react';
import { action } from '@storybook/addon-actions';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import InputText from '@components/molecules/InputText';
import { Button } from '@components/atoms/Button';
import { FormBox } from './index';

export default { title: 'Layouts|FormBox' };

export const WrapText = () => <FormBox>Text content</FormBox>;

export const Form = () => (
  <FormBox>
    <FormGroup>
      <FormControl>
        <InputText type="text" placeholder="Email" value={''} label="Email" onChange={action('change')} />
      </FormControl>
      <FormControl>
        <InputText type="password" placeholder="Password" value={''} label="Password" onChange={action('change')} />
      </FormControl>
    </FormGroup>
    <FormGroup>
      <FormControl>
        <Button>Submit</Button>
      </FormControl>
    </FormGroup>
  </FormBox>
);
