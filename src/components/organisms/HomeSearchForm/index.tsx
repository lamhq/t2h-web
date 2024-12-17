/* eslint-disable no-restricted-imports */
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { WithTranslation } from 'next-i18next';
import { Button } from '@components/atoms/Button';
import Dropdown, { DropdownItem } from '@components/molecules/Dropdown';
import { Controller, FormContextValues } from 'react-hook-form';

const Form = styled.form`
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

export interface HomeSearchFormData {
  category: string;
  subCategory: string;
  brand: string;
  year: string;
}

export interface HomeSearchFormProps extends WithTranslation {
  formContext: FormContextValues<HomeSearchFormData>;
  onSubmit: (values: HomeSearchFormData) => void;
  categoryOptions: DropdownItem[];
  subCategoryOptions: DropdownItem[];
  brandOptions: DropdownItem[];
  yearOptions: DropdownItem[];
}

const HomeSearchForm: React.FC<HomeSearchFormProps> = (props: React.PropsWithChildren<HomeSearchFormProps>) => {
  const { t, formContext, onSubmit, categoryOptions, subCategoryOptions, brandOptions, yearOptions } = props;

  const { handleSubmit, control, getValues } = formContext;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Controller
            as={<Dropdown name="category" placeholder={t('Category')} options={categoryOptions} isLeftIconVisible={false} />}
            name="category"
            control={control}
            onChange={(changes) => (changes.length > 0 ? changes[0].value : undefined)}
            defaultValue={getValues('category')}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            as={<Dropdown name="subCategory" placeholder={t('Subcategory')} options={subCategoryOptions} isLeftIconVisible={false} />}
            name="subCategory"
            control={control}
            onChange={(changes) => (changes.length > 0 ? changes[0].value : undefined)}
            defaultValue={getValues('subCategory')}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            as={<Dropdown name="brand" placeholder={t('Brand')} options={brandOptions} isLeftIconVisible={false} />}
            name="brand"
            control={control}
            onChange={(changes) => (changes.length > 0 ? changes[0].value : undefined)}
            defaultValue={getValues('brand')}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            as={<Dropdown name="year" placeholder={t('Year')} options={yearOptions} isLeftIconVisible={false} />}
            name="year"
            control={control}
            onChange={(changes) => (changes.length > 0 ? changes[0].value : undefined)}
            defaultValue={getValues('year')}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="secondary" fontSize={3}>
            {t('SEARCH NOW')}
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};

export default withTranslation('common')(HomeSearchForm);
