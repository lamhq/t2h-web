import React, { useCallback } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import InputText from '@components/molecules/InputText';
import Dropdown, { DropdownItem } from '@components/molecules/Dropdown';
import { FormGroup, FormControl } from '@components/layouts/FormGroup';
import { FormContextValues, Controller } from 'react-hook-form';
import { Text, TextLabel } from '@components/atoms/Text';
import Grid from '@components/layouts/Grid';
import Box from '@components/layouts/Box';
import InputTextDropdown from '@components/molecules/InputTextDropdown';
import RadioButton from '@components/molecules/RadioButton';
import RadioGroup, { RadioGroupProps } from '@components/molecules/RadioGroup';
import { TFunction } from 'next-i18next';
import { ItemStatus, SearchOrderTypes } from '@services/types';

export enum SearchItemStatus {
  Any = 'any',
  Published = 'published',
  Sold = 'sold',
}

export interface SearchFormGroupValues {
  q: string;
  sorting: SearchOrderTypes;
  lowerBound: string;
  upperBound: string;
  purchaseYear: string;
  categories: string[];
  area: string;
  province: string;
  brand: string;
  status: SearchItemStatus;
}

export interface SearchFormGroupProps extends WithTranslation {
  formContext: FormContextValues<SearchFormGroupValues>;
  sortOptions: DropdownItem[];
  yearOptions: DropdownItem[];
  categoryOptions: DropdownItem[][];
  brandOptions: string[];
  areaOptions: DropdownItem[];
  provinceOptions: DropdownItem[];
  isSortDropdownHidden?: boolean;
}

const StatusRadioGroup = (props: RadioGroupProps & { t: TFunction }) => {
  const { t, ...rest } = props;

  return (
    <RadioGroup flexDirection="column" {...rest}>
      <RadioButton value={null} label={t('Any')} />
      <RadioButton value={ItemStatus.Sold} label={t('Sold')} />
      <RadioButton value={ItemStatus.Published} label={t('Selling')} />
    </RadioGroup>
  );
};

const SearchFormGroup: React.FC<SearchFormGroupProps> = (props: SearchFormGroupProps) => {
  const {
    t,
    formContext,
    sortOptions,
    yearOptions,
    categoryOptions,
    brandOptions,
    areaOptions,
    provinceOptions,
    isSortDropdownHidden,
  } = props;
  const { register, getValues, reset, control } = formContext;

  const handleBlur = useCallback(
    (e) => {
      if (!brandOptions.find((v) => v == e.currentTarget.value)) {
        reset({ brand: '' });
      }
    },
    [reset, brandOptions],
  );

  return (
    <FormGroup>
      {isSortDropdownHidden !== true && (
        <FormControl>
          <Text mb={1} mt={0} variant="small">
            {t(`Sort`)}
          </Text>
          <Controller
            as={<Dropdown placeholder={t('Select sort')} options={sortOptions} />}
            name="sorting"
            control={control}
            onChange={(changes) => {
              return changes.length > 0 ? changes[0].value : undefined;
            }}
            defaultValue={getValues('sorting')}
          />
        </FormControl>
      )}

      <FormControl mt={3} mb={0}>
        <Text mb={1} mt={0} variant="small">
          {t(`Price range`)} (THB)
        </Text>
        <Grid display="grid" alignItems="center" gridTemplateColumns="auto 20px auto">
          <Grid gridGap={0} gridRow={1}>
            <InputText ref={register} type="number" name="lowerBound" defaultValue={getValues('lowerBound')} />
          </Grid>
          <Grid gridGap={0} gridRow={1} display="flex" justifyContent="center">
            <TextLabel textAlign="center">~</TextLabel>
          </Grid>
          <Grid gridGap={0} gridRow={1}>
            <InputText ref={register} type="number" name="upperBound" defaultValue={getValues('upperBound')} />
          </Grid>
        </Grid>
      </FormControl>
      <FormControl mt={3} mb={0}>
        <Text mb={1} mt={0} variant="small">
          {t(`Year`)}
        </Text>
        <Controller
          as={<Dropdown placeholder={t('Select year')} options={yearOptions} />}
          name="purchaseYear"
          control={control}
          onChange={(changes) => {
            return changes.length > 0 ? changes[0].value : undefined;
          }}
          defaultValue={getValues('purchaseYear')}
        />
      </FormControl>
      <FormControl mt={3} mb={0}>
        <Text mb={1} mt={0} variant="small">
          {t(`Category`)}
        </Text>
        {categoryOptions.map((categoryList, idx) => (
          <Box key={idx} mb={1}>
            <Controller
              as={<Dropdown options={categoryList} placeholder={t('Select Category')} />}
              name={`categories[${idx}]`}
              control={control}
              onChange={(changes) => {
                return changes.length > 0 ? changes[0].value : undefined;
              }}
              defaultValue={getValues(`categories[${idx}]`)}
            />
          </Box>
        ))}
      </FormControl>

      <FormControl mt={3} mb={0}>
        <Text mb={1} mt={0} variant="small">
          {t(`Location`)}
        </Text>
        <Box mb={1}>
          <Controller
            as={<Dropdown options={areaOptions} placeholder={t('Select Area')} />}
            name="area"
            control={control}
            onChange={(changes) => {
              return changes.length > 0 ? changes[0].value : undefined;
            }}
          />
        </Box>
        <Box mb={1}>
          <Controller
            as={<Dropdown options={provinceOptions} placeholder={t('Select Province')} />}
            name="province"
            control={control}
            onChange={(changes) => {
              return changes.length > 0 ? changes[0].value : undefined;
            }}
            defaultValue={getValues('province')}
          />
        </Box>
      </FormControl>
      <FormControl mt={3} mb={0}>
        <Text mb={1} mt={0} variant="small">
          {t(`Brand`)}
        </Text>
        <Controller
          as={<InputTextDropdown name="brand" onBlur={handleBlur} items={brandOptions} defaultValue={getValues('brand')} />}
          name="brand"
          control={control}
          onChange={(changes) => {
            return changes.length > 0 ? changes[0].target.value : undefined;
          }}
          defaultValue={getValues('brand')}
        />
      </FormControl>
      <FormControl mt={3} mb={0}>
        <Text mb={1} mt={0} variant="small">
          {t(`Status`)}
        </Text>
        <Controller
          as={StatusRadioGroup}
          name="status"
          control={control}
          value={getValues('status')}
          defaultValue={getValues('status')}
          t={t}
        />
      </FormControl>
    </FormGroup>
  );
};

SearchFormGroup.displayName = 'SearchFormGroup';

export default withTranslation('common')(SearchFormGroup);
