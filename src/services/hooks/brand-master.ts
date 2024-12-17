import React from 'react';
import { BrandMasterApi } from '@services/apis';
import { BrandArrayResponse, BrandResponse } from '@services/types';

export interface CategoryMasterHooksProps {
  brandMasterApi: ReturnType<typeof BrandMasterApi>;
  defaultSelectedCategory: string;
  defaultSelectedBrand: string;
  onSelectedBrandChange?: (brand?: BrandResponse) => void;
}

export interface BrandMasterHooksState {
  brands: BrandArrayResponse;
  selectedCategoryHashId: string;
  selectedBrandHashId: string;
  isInitializeDataLoaded: boolean;
}

export const useBrandMaster = (props: CategoryMasterHooksProps) => {
  const { brandMasterApi, defaultSelectedCategory, defaultSelectedBrand, onSelectedBrandChange } = props;

  const [state, setState] = React.useState<BrandMasterHooksState>({
    brands: [],
    selectedCategoryHashId: defaultSelectedCategory,
    selectedBrandHashId: defaultSelectedBrand,
    isInitializeDataLoaded: false,
  });

  React.useEffect(() => {
    (async () => {
      const brands = defaultSelectedCategory ? await brandMasterApi.getBrandsByCategoryHashId(defaultSelectedCategory) : [];
      const selectedBrand = brands.find((b) => b.hashId === defaultSelectedBrand);

      onSelectedBrandChange(selectedBrand ?? null);

      setState({
        brands: brands,
        selectedCategoryHashId: defaultSelectedCategory,
        selectedBrandHashId: selectedBrand?.hashId ?? null,
        isInitializeDataLoaded: true,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSelectedCategory = React.useCallback(
    async (categoryHashId: string) => {
      const { selectedBrandHashId } = state;

      const brands = categoryHashId ? await brandMasterApi.getBrandsByCategoryHashId(categoryHashId) : [];
      const newSelectedBrand = brands.find((b) => b.hashId === selectedBrandHashId);

      if (selectedBrandHashId && !newSelectedBrand) {
        onSelectedBrandChange(null);
      }

      setState((prevState) => ({
        ...prevState,
        brands: brands,
        selectedCategoryHashId: categoryHashId,
        selectedBrandHashId: newSelectedBrand?.hashId ?? null,
      }));
    },
    [brandMasterApi, onSelectedBrandChange, setState, state],
  );

  const updateSelectedBrand = React.useCallback(
    (selectedBrandHashId: string) => {
      setState((prevState) => ({
        ...prevState,
        selectedBrandHashId,
      }));
    },
    [setState],
  );

  const { brands, selectedBrandHashId, isInitializeDataLoaded } = state;

  return {
    brands,
    selectedBrandHashId,
    updateSelectedCategory,
    updateSelectedBrand,
    isInitializeDataLoaded,
  };
};
