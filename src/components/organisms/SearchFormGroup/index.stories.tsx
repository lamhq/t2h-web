import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@components/atoms/Button';
import { FormControl } from '@components/layouts/FormGroup';
import { SearchOrderTypes } from '@services/types';
import SearchFormGroup, { SearchFormGroupValues, SearchItemStatus } from './index';

export default { title: 'Organisms|SearchFormGroup' };

export const Normal = () => {
  const cxt = useForm<SearchFormGroupValues>({
    mode: 'onChange',
    defaultValues: {
      q: '',
      sorting: SearchOrderTypes.HighestPrice,
      lowerBound: '0',
      upperBound: '1000',
      purchaseYear: '2020',
      categories: ['2', '-'],
      area: 'metropolitan',
      province: 'bangkok',
      brand: '',
      status: SearchItemStatus.Any,
    },
  });

  const years = [
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
  ];

  const sorts = [
    { value: 'recommended', label: 'Recommended (Default)' },
    { value: 'highest_price', label: 'Highest Price' },
    { value: 'lowest_price', label: 'Lowest Price' },
    { value: 'newest', label: 'Newest' },
  ];

  const categoryDoubleList = [
    [
      { label: 'Select 1st category', value: '-' },
      { label: 'Construction', value: '1' },
      { label: 'Transportation', value: '2' },
      { label: 'Agriculture', value: '3' },
    ],
    [
      { label: 'Select 2nd category', value: '-' },
      { label: 'Category A', value: '4' },
      { label: 'Category B', value: '5' },
      { label: 'Category C', value: '6' },
    ],
  ];
  const areas = [
    { label: 'Metropolitan Area', value: 'metropolitan' },
    { label: 'North Area', value: 'north' },
  ];
  const provinces = [
    { label: 'Bangkok', value: 'bangkok' },
    { label: 'Chiangmai', value: 'chiangmai' },
  ];
  const brands = ['ISUZU', 'HINO'];
  const { handleSubmit } = cxt;
  const onSubmit = useCallback((v) => {
    console.log(v);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <SearchFormGroup
          formContext={cxt}
          sortOptions={sorts}
          categoryOptions={categoryDoubleList}
          areaOptions={areas}
          provinceOptions={provinces}
          brandOptions={brands}
          yearOptions={years}
        />
      </FormControl>
      <FormControl>
        <Button type="submit" variant="primary">
          Apply
        </Button>
      </FormControl>
    </form>
  );
};
