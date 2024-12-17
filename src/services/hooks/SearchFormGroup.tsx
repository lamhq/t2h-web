import React from 'react';
import { FormContextValues, useForm } from 'react-hook-form';
import { DropdownItem } from '@components/molecules/Dropdown';
import { SearchFormGroupValues } from '@components/organisms/SearchFormGroup';
import { BrandResponse, CategoryArrayResponse, CategoryResponse } from '@services/types';
import { CategoryMasterApi, BrandMasterApi, ProvinceMasterApi } from '@services/apis';
import { useTranslation } from '@server/i18n';
import { useValueChangeDetector, useDelayState } from '@common/utils/hooks';
import { safeKey, isInteger } from '@common/utils';
import { useProvinceMaster } from './province';
import { useCategoryMaster } from './category-master';
import { useBrandMaster } from './brand-master';

const DELAY_PRICE_CHANGE = 1000;

// eslint-disable-next-line complexity
export const validatePriceRange = (lowerBound: string = '', upperBound: string = '') => {
  const lb = isInteger(lowerBound) ? Number.parseInt(lowerBound) : null;
  const ub = isInteger(upperBound) ? Number.parseInt(upperBound) : null;

  if (lowerBound.length === 0 && upperBound.length === 0) {
    return true;
  } else if (lowerBound.length === 0) {
    if (ub !== null && ub >= 0) {
      return true;
    }
  } else if (upperBound.length === 0) {
    if (lb !== null && lb >= 0) {
      return true;
    }
  } else if (lb !== null && ub !== null) {
    if (lb >= 0 && ub >= 0 && lb <= ub) {
      return true;
    }
  }

  return false;
};

const getCategoryHashIdForBrands = (categories: CategoryArrayResponse[], selectedCategories: string[]) => {
  const mainCategory = (categories[0] ?? []).find((cat) => cat.hashId === selectedCategories[0]);

  if (mainCategory?.englishName === 'Truck') {
    return selectedCategories.length > 1 ? selectedCategories[1] : selectedCategories[0];
  }

  return selectedCategories[selectedCategories.length - 1];
};

export const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Highest Price', value: 'highest_price' },
  { label: 'Lowest Price', value: 'lowest_price' },
  { label: 'Newest', value: 'newest' },
];

const years = Array.from(Array(20), (_v, k) => {
  const v = new Date().getFullYear() - k;

  return { value: `${v}`, label: `${v}` };
});

const getCategoriesFromFormValue = (formValues: SearchFormGroupValues) => {
  const categories: string[] = [];

  for (const key of Object.keys(formValues)) {
    const res = key.match(/categories\[(\d+)\]/);

    if (res) {
      categories[safeKey(+res[1])] = formValues[safeKey(key)];
    }
  }

  return categories.filter(Boolean);
};

export interface SearchFormGroupStateHooksProps {
  categoryMasterApi: ReturnType<typeof CategoryMasterApi>;
  brandMasterApi: ReturnType<typeof BrandMasterApi>;
  provinceMasterApi: ReturnType<typeof ProvinceMasterApi>;
  defaultFormValues: SearchFormGroupValues;
  onChange: (values: SearchFormGroupValues) => void;
}

export interface SearchFormGroupState {
  formContext: FormContextValues<SearchFormGroupValues>;
  sortOptions: DropdownItem[];
  yearOptions: DropdownItem[];
  categoryOptions: DropdownItem[][];
  brandOptions: string[];
  areaOptions: DropdownItem[];
  provinceOptions: DropdownItem[];
}

export const useSearchFormGroupState = (props: SearchFormGroupStateHooksProps) => {
  const { categoryMasterApi, brandMasterApi, provinceMasterApi, defaultFormValues, onChange } = props;
  const { t, i18n } = useTranslation();

  const formContext = useForm<SearchFormGroupValues>({
    mode: 'onBlur',
    defaultValues: {
      ...defaultFormValues,
      brand: null,
    },
  });
  const { watch, getValues, setValue, reset } = formContext;
  const formValues = watch();

  const defaultSelectedCategories = React.useMemo(() => getCategoriesFromFormValue(defaultFormValues), []);
  const selectedCategories = React.useMemo(() => getCategoriesFromFormValue(formValues), [formValues]);

  const brandMasterState = useBrandMaster({
    brandMasterApi,
    defaultSelectedCategory: defaultSelectedCategories[defaultSelectedCategories.length - 1],
    defaultSelectedBrand: defaultFormValues.brand,
    onSelectedBrandChange: React.useCallback(
      (brand: BrandResponse) => {
        setValue('brand', brand?.name ?? null);
      },
      [setValue],
    ),
  });

  let categoryMasterState: ReturnType<typeof useCategoryMaster>;

  // eslint-disable-next-line prefer-const
  categoryMasterState = useCategoryMaster({
    categoryMasterApi,
    defaultSelectedCategories,
    onSelectedCategoriesChange: React.useCallback(
      (newSelectedCategories: CategoryArrayResponse) => {
        const newSelectedCategoryHashIds = newSelectedCategories.map((cat) => cat.hashId);

        const newFormValues = { ...formValues };

        for (const key of Object.keys(formValues)) {
          const res = key.match(/categories\[(\d+)\]/);

          if (res && formValues[safeKey(key)]) {
            const value = newSelectedCategoryHashIds[safeKey(+res[1])] ?? null;

            newFormValues[safeKey(key)] = value;
          }
        }
        reset(newFormValues);

        if (brandMasterState.isInitializeDataLoaded) {
          const categoryHashIdForBrandMaster = getCategoryHashIdForBrands(categoryMasterState.categoriesList, newSelectedCategoryHashIds);

          brandMasterState.updateSelectedCategory(categoryHashIdForBrandMaster);
        }
      },
      [reset, formValues, categoryMasterState, brandMasterState],
    ),
  });

  const { regionNames, regionNameToProvinces } = useProvinceMaster(provinceMasterApi);

  React.useEffect(() => {
    const values = getValues();
    const area = values.area as string;
    const province = values.province as string;

    if (regionNames.findIndex((name) => name === area) === -1) {
      setValue('area', null);
      setValue('province', null);

      return;
    }

    const provinces = regionNameToProvinces[safeKey(area)];

    if (provinces.find((p) => p.hashId === province) === undefined) {
      setValue('province', null);

      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionNames, regionNameToProvinces]);

  const categoryOptions = React.useMemo(
    () =>
      categoryMasterState.categoriesList.map((categoryList: CategoryArrayResponse) =>
        [{ label: t('Any'), value: null }].concat(
          categoryList.map((category: CategoryResponse) => ({
            value: category.hashId,
            label: t(category.englishName),
          })),
        ),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language, categoryMasterState.categoriesList],
  );

  const sortOptions = React.useMemo(() => {
    return SORT_OPTIONS.map((option) => ({
      ...option,
      label: t(option.label),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.language]);

  const yearOptions = React.useMemo(() => {
    const anyItem = { value: null, label: t('Any') };

    return [anyItem, ...years];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.language]);

  const brandOptions = React.useMemo(
    () => brandMasterState.brands.map((brand: BrandResponse) => t(brand.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language, brandMasterState.brands],
  );

  const areaOptions = React.useMemo(
    () =>
      regionNames.map((name: string) => ({
        label: t(name),
        value: name,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language, regionNames],
  );

  const provinceOptions = React.useMemo(() => {
    if (formValues.area && regionNameToProvinces[safeKey(formValues.area)] !== undefined) {
      return regionNameToProvinces[safeKey(formValues.area)].map((province) => ({
        label: t(province.englishName),
        value: province.hashId,
      }));
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.language, formValues.area, regionNameToProvinces]);

  const handleChange = React.useCallback(() => {
    if (categoryMasterState.isInitializeDataLoaded && brandMasterState.isInitializeDataLoaded) {
      const brandObject = brandMasterState.brands.find((b) => b.name === formValues.brand);
      const values = { ...formValues, brand: brandObject?.hashId };

      onChange(values);
    }
  }, [onChange, formValues, categoryMasterState, brandMasterState]);

  useValueChangeDetector(
    selectedCategories,
    React.useCallback(
      (selectedCategories: string[]) => {
        if (categoryMasterState.isInitializeDataLoaded) {
          categoryMasterState.updateSelectedCategories(selectedCategories);
        }

        if (brandMasterState.isInitializeDataLoaded) {
          const categoryHashIdForBrandMaster = getCategoryHashIdForBrands(categoryMasterState.categoriesList, selectedCategories);

          brandMasterState.updateSelectedCategory(categoryHashIdForBrandMaster);
        }
      },
      [categoryMasterState, brandMasterState],
    ),
  );

  useValueChangeDetector(
    formValues['brand'],
    React.useCallback(
      (newSelectedBrand: string) => {
        if (brandMasterState.isInitializeDataLoaded) {
          const brand = brandMasterState.brands.find((b) => b.name === newSelectedBrand);

          brandMasterState.updateSelectedBrand(brand?.hashId);
        }
      },
      [brandMasterState],
    ),
  );

  useValueChangeDetector(
    formValues['area'],
    React.useCallback(
      (newArea: string) => {
        const provinces = regionNameToProvinces[safeKey(newArea)] ?? [];
        const currentProvince = formValues['province'];

        if (provinces.findIndex((p) => p.hashId === currentProvince) === -1) {
          setValue('province', null);
        }
      },
      [setValue, formValues, regionNameToProvinces],
    ),
  );

  useValueChangeDetector(selectedCategories, handleChange);

  useValueChangeDetector(watch(['sorting', 'purchaseYear', 'province', 'brand', 'status']), handleChange);

  const [, lowerBound, setLowerBound] = useDelayState(formValues['lowerBound'], DELAY_PRICE_CHANGE);
  const [, upperBound, setUpperBound] = useDelayState(formValues['upperBound'], DELAY_PRICE_CHANGE);

  useValueChangeDetector(
    watch(['lowerBound', 'upperBound']),
    React.useCallback(
      (values: Pick<SearchFormGroupValues, 'lowerBound' | 'upperBound'>) => {
        setLowerBound(values['lowerBound']);
        setUpperBound(values['upperBound']);
      },
      [setLowerBound, setUpperBound],
    ),
  );

  useValueChangeDetector(
    { lowerBound, upperBound },
    React.useCallback(
      (values: { lowerBound: string; upperBound: string }) => {
        if (validatePriceRange(values.lowerBound ?? '', values.upperBound ?? '')) {
          handleChange();
        }
      },
      [handleChange],
    ),
  );

  return {
    formContext,
    sortOptions,
    yearOptions,
    categoryOptions: categoryOptions,
    brandOptions,
    areaOptions,
    provinceOptions,
  };
};
