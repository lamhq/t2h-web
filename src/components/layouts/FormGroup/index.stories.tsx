import React from 'react';
import { action } from '@storybook/addon-actions';
import InputText from '@components/molecules/InputText';
import Dropdown from '@components/molecules/Dropdown';
import { Button } from '@components/atoms/Button';
import { FormControl, FormGroup } from './index';

export default { title: 'Layouts|FormGroup' };

export const Form = () => (
  <React.Fragment>
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
        <InputText type="text" placeholder="Address" value={''} label="Address" onChange={action('change')} />
      </FormControl>
      <FormControl>
        <label>How many items do you need?</label>
        <Dropdown
          options={[
            { value: null, label: '-' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
          ]}
          placeholder="How many items do you need?"
          onChange={action('item is selected')}
        />
      </FormControl>
    </FormGroup>
    <FormGroup>
      <FormControl>
        <Button>Submit</Button>
      </FormControl>
    </FormGroup>
  </React.Fragment>
);
