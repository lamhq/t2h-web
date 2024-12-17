import React from 'react';
import { useForm, FormContextValues } from 'react-hook-form';
import { CategoryMasterApi, BrandMasterApi } from '@services/apis';
import { HomeSearchFormData } from '@components/organisms/HomeSearchForm';
import { DropdownItem } from '@components/molecules/Dropdown';
import { CategoryResponse, BrandArrayResponse, BrandResponse, CategoryArrayResponse } from '@services/types';
import { TFunction, I18n } from 'next-i18next';

const YEAR_OPTIONS = Array.from(Array(20), (_v, k) => {
  const v = new Date().getFullYear() - k;

  return { value: `${v}`, label: `${v}` };
});

const concatAnyOption = (anyLabel: string, options: DropdownItem[]) => {
  return [{ value: null, label: anyLabel } as DropdownItem].concat(options);
};

const categoryMasterToOption = (data: CategoryResponse, t: TFunction): DropdownItem => {
  return {
    value: data.hashId,
    label: t(data.englishName),
  };
};

const brandMasterToOption = (data: BrandResponse, t: TFunction): DropdownItem => {
  return {
    value: data.hashId,
    label: t(data.name),
  };
};

export interface HomeSearchFormState {
  formContext: FormContextValues<HomeSearchFormData>;
  categoryOptions: DropdownItem[];
  subCategoryOptions: DropdownItem[];
  brandOptions: DropdownItem[];
  yearOptions: DropdownItem[];
}

export const useHomeSearchFormState = (
  t: TFunction,
  i18n: I18n,
  categoryMasterApi: ReturnType<typeof CategoryMasterApi>,
  brandMasterApi: ReturnType<typeof BrandMasterApi>,
): HomeSearchFormState => {
  const defaultValues = {
    category: '',
    subCategory: '',
    brand: '',
    year: '',
  };
  const formContext = useForm<HomeSearchFormData>({
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { watch, setValue } = formContext;

  const [categories, setCategories] = React.useState<CategoryArrayResponse>([]);
  const [subCategories, setSubCategories] = React.useState<CategoryArrayResponse>([]);
  const [brands, setBrands] = React.useState<BrandArrayResponse>([]);

  React.useEffect(() => {
    (async () => {
      const [categories, brands] = await Promise.all([
        categoryMasterApi.getRootCategories({ page: 1, perPage: 100 }),
        brandMasterApi.getBrands({ page: 1, perPage: 100 }),
      ]);

      setCategories(categories);
      setBrands(brands);
    })();
  }, [categoryMasterApi, brandMasterApi, setCategories, setBrands]);

  const [lastValues, setLastValues] = React.useState<HomeSearchFormData>(defaultValues);
  const values = watch(['category', 'subCategory', 'brand']);

  const updateSubCategories = React.useCallback(
    async (values: { category: string; subCategory: string; brand: string }) => {
      let subCategories: CategoryArrayResponse = [];
      let selectedSubCategory: CategoryResponse;

      if (values.category) {
        subCategories = await categoryMasterApi.getSubCategories(values.category);
        selectedSubCategory = subCategories.find((c) => c.hashId === values.subCategory);
      }

      if (!selectedSubCategory) {
        setValue('subCategory', null);
      }

      setSubCategories(subCategories);
    },
    [categoryMasterApi, setValue],
  );

  const updateBrands = React.useCallback(
    async (values: { category: string; subCategory: string; brand: string }) => {
      let brands: BrandArrayResponse = [];

      const categoryHashId = values.subCategory ? values.subCategory : values.category;

      if (categoryHashId) {
        brands = await (categoryHashId
          ? brandMasterApi.getBrandsByCategoryHashId(categoryHashId)
          : brandMasterApi.getBrands({ page: 1, perPage: 100 }));
      }

      const selectedBrand = brands.find((b) => b.hashId === values.brand);

      if (!selectedBrand) {
        setValue('brand', '');
      }

      setBrands(brands);
    },
    [brandMasterApi, setValue],
  );

  React.useEffect(() => {
    (async () => {
      if (values.category !== lastValues?.category) {
        setLastValues((lastValues) => ({ ...lastValues, ...values }));
        await updateSubCategories(values);
        await updateBrands(values);
      } else if (values.subCategory !== lastValues?.subCategory) {
        setLastValues((lastValues) => ({ ...lastValues, ...values }));
        if (values.subCategory) {
          await updateBrands(values);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, setLastValues, updateSubCategories, updateBrands]);

  const categoryOptions = React.useMemo(() => {
    const categoryOptions = categories.map((c) => categoryMasterToOption(c, t));

    return concatAnyOption(t('Any'), categoryOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, t, categories]);
  const subCategoryOptions = React.useMemo(() => {
    const subCategoryOptions = subCategories.map((c) => categoryMasterToOption(c, t));

    return concatAnyOption(t('Any'), subCategoryOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, t, subCategories]);
  const brandOptions = React.useMemo(() => {
    const brandOptions = brands.map((b) => brandMasterToOption(b, t));

    return concatAnyOption(t('Any'), brandOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, t, brands]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const yearOptions = React.useMemo(() => concatAnyOption(t('Any'), YEAR_OPTIONS), [i18n.language, t]);

  return {
    formContext,
    categoryOptions,
    subCategoryOptions,
    brandOptions,
    yearOptions,
  };
};
