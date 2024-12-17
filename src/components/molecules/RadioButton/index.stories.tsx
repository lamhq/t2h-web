import React from 'react';
import Flex from '@components/layouts/Flex';
import RadioButton, { RadioValueContext } from './index';

export default { title: 'Molecules|RadioButton' };

export const Normal = () => {
  const [value, setValue] = React.useState<string>('');
  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <Flex flexDirection="column">
      <RadioValueContext.Provider value={{ value, onChange: handleChange }}>
        <RadioButton value="all_categories" label={'All categories'} />
        <RadioButton value="construction" label={'Construction'} />
        <RadioButton value="transportation" label={'Transportation'} />
      </RadioValueContext.Provider>
    </Flex>
  );
};
