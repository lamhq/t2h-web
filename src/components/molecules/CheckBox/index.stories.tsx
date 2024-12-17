import React from 'react';
import Flex from '@components/layouts/Flex';
import { action } from '@storybook/addon-actions';
import CheckBox from './index';

export default { title: 'Molecules|CheckBox' };

export const Normal = () => {
  const [checked, setChecked] = React.useState({});
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      action('toggled')(e.target.name, e.target.value);
      const name = e.target.name;
      const isChecked = e.target.checked;

      setChecked((prevState) => {
        return {
          ...prevState,
          [name]: isChecked,
        };
      });
    },
    [setChecked],
  );

  return (
    <Flex flexDirection="column">
      <CheckBox
        id="all_categories"
        name="all_categories"
        label={'All categories'}
        checked={checked['all_categories']}
        onChange={onChange}
      />
      <CheckBox id="construction" name="construction" label={'Construction'} checked={checked['construction']} onChange={onChange} />
      <CheckBox
        id="transportation"
        name="transportation"
        label={'Transportation'}
        checked={checked['transportation']}
        onChange={onChange}
      />
      <CheckBox id="no_label" name="no_label" checked={checked['no_label']} onChange={onChange} />
    </Flex>
  );
};
