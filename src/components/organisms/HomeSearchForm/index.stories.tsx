import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import HomeSearchForm, { HomeSearchFormData } from './index';

const Page = styled.div`
  width: 320px;
`;

const options = [
  { value: null, label: '- Please select -' },
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

export default { title: 'Organisms|HomeSearchForm' };

export const Standard = () => {
  function handleSubmit(values: HomeSearchFormData) {
    console.log(values);
  }

  const formContext = useForm<any>({
    mode: 'onChange',
  });

  return (
    <Page>
      <HomeSearchForm
        formContext={formContext}
        categoryOptions={options}
        subCategoryOptions={options}
        brandOptions={options}
        yearOptions={options}
        onSubmit={handleSubmit}
      />
    </Page>
  );
};
