import React from 'react';
import RadioButton from '@components/molecules/RadioButton';
import RadioGroup from './';

export default { title: 'Molecules|RadioGroup' };

export const Horizontal = () => {
  const [value, setValue] = React.useState<string>('all_categories');
  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <RadioGroup flexDirection="row" onChange={handleChange} value={value}>
      <RadioButton value="all_categories" label={'All categories'} />
      <RadioButton value="construction" label={'Construction'} />
      <RadioButton value="transportation" label={'Transportation'} />
    </RadioGroup>
  );
};

export const Vertical = () => {
  const [value, setValue] = React.useState<string>('all_categories');
  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <RadioGroup flexDirection="column" onChange={handleChange} value={value}>
      <RadioButton value="all_categories" label={'All categories'} />
      <RadioButton value="construction" label={'Construction'} />
      <RadioButton value="transportation" label={'Transportation'} />
    </RadioGroup>
  );
};
