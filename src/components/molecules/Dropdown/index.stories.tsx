import React from 'react';
import { action } from '@storybook/addon-actions';
import Image from '@components/atoms/Image';
import Dropdown, { DropdownItem } from './index';

export default { title: 'Molecules|Dropdown' };

export const Standard = () => (
  <React.Fragment>
    <Dropdown
      options={[
        { value: null, label: '-' },
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ]}
      placeholder="Please select items from the list"
      onChange={action('item is selected')}
    />
  </React.Fragment>
);

export const InitailValue = () => (
  <React.Fragment>
    <Dropdown
      options={[
        { value: null, label: '-' },
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ]}
      value={'one'}
      placeholder="Please select items from the list"
      onChange={action('item is selected')}
    />
  </React.Fragment>
);

export const Many = () => (
  <React.Fragment>
    <Dropdown
      options={Array.from(Array(20), (_v, k) => {
        return { value: k.toString(), label: k.toString() };
      })}
      placeholder="Please select items from the list"
      onChange={action('item is selected')}
    />
  </React.Fragment>
);

const IconRenderer: React.FC<DropdownItem> = ({ value }: DropdownItem) => {
  console.log('IconRendrer', value);
  if (value === 'one') {
    return <Image src="/static/images/2.jpg" shape="circle" />;
  } else if (value === 'two') {
    return null;
  } else if (value === 'three') {
    return <Image src="/static/images/4.jpg" shape="circle" />;
  }

  return <Image src="/static/images/1.jpg" shape="circle" />;
};

export const WithIcon = () => (
  <React.Fragment>
    <Dropdown
      options={[
        { value: null, label: '-' },
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
      ]}
      value={null}
      placeholder="Please select items from the list"
      onChange={action('item is selected')}
      isLeftIconVisible={true}
      leftIconRenderer={IconRenderer}
    />
  </React.Fragment>
);
