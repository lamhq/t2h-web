import React from 'react';
import { CategoryMasterApi } from '@services/apis';
import { CategoryArrayResponse } from '@services/types';
import { safeKey, objectShallowEquals } from '@common/utils/functions';

export interface CategoryMasterHooksProps {
  categoryMasterApi: ReturnType<typeof CategoryMasterApi>;
  defaultSelectedCategories: string[];
  onSelectedCategoriesChange?: (selectedCategories: CategoryArrayResponse) => void;
}

export interface CategoryMasterHooksState {
  categoriesList: CategoryArrayResponse[];
  selectedCategories: string[];
  isInitializeDataLoaded: boolean;
}

export const useCategoryMaster = (props: CategoryMasterHooksProps) => {
  const { categoryMasterApi, defaultSelectedCategories, onSelectedCategoriesChange } = props;

  const [state, setState] = React.useState<CategoryMasterHooksState>({
    categoriesList: [],
    selectedCategories: defaultSelectedCategories,
    isInitializeDataLoaded: false,
  });

  React.useEffect(() => {
    (async () => {
      const getSubCategory = async (hashId: string) => {
        try {
          return await categoryMasterApi.getSubCategories(hashId);
        } catch (error) {
          return [];
        }
      };

      const [defaultRootCategories, defaultSubCategories] = await Promise.all([
        categoryMasterApi.getRootCategories({ page: 1, perPage: 100 }),
        Promise.all(defaultSelectedCategories.map(getSubCategory)),
      ]);

      const categoriesList = [defaultRootCategories, ...defaultSubCategories.filter((c) => c.length > 0)];

      const filteredSelectedCategories = defaultSelectedCategories
        .map((hashId, index) =>
          categoriesList[safeKey(index)] !== undefined
            ? categoriesList[safeKey(index)].find((category) => category.hashId === hashId)
            : null,
        )
        .filter(Boolean);

      setState({
        categoriesList,
        selectedCategories: filteredSelectedCategories.map((cat) => cat.hashId),
        isInitializeDataLoaded: true,
      });

      onSelectedCategoriesChange(filteredSelectedCategories);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSelectedCategories = React.useCallback(
    (newSelectedCategories: string[]) => {
      (async () => {
        const { categoriesList, selectedCategories } = state;

        const index = newSelectedCategories.findIndex((cat, i) => selectedCategories[safeKey(i)] !== cat);

        if (index >= 0) {
          const categoryHashId = newSelectedCategories[safeKey(index)];

          const subCategories = await categoryMasterApi.getSubCategories(categoryHashId);
          const newCategoriesList =
            subCategories.length > 0 ? categoriesList.slice(0, index + 1).concat([subCategories]) : categoriesList.slice(0, index + 1);

          const filteredNewSelectedCategories = newSelectedCategories
            .slice(0, index + 1)
            .map((categoryHashId: string, index: number) =>
              newCategoriesList[safeKey(index)]
                ? newCategoriesList[safeKey(index)].find((category) => category.hashId === categoryHashId)
                : null,
            )
            .filter(Boolean);

          setState((prevState) => ({
            ...prevState,
            categoriesList: newCategoriesList,
            selectedCategories: filteredNewSelectedCategories.map((cat) => cat.hashId),
          }));

          if (!objectShallowEquals(newSelectedCategories, filteredNewSelectedCategories)) {
            onSelectedCategoriesChange(filteredNewSelectedCategories);
          }
        } else if (newSelectedCategories.length === 0) {
          setState((prevState) => ({
            ...prevState,
            categoriesList: categoriesList.slice(0, 1),
            selectedCategories: newSelectedCategories,
          }));
        }
      })();
    },
    [categoryMasterApi, state, setState, onSelectedCategoriesChange],
  );

  const { categoriesList, selectedCategories, isInitializeDataLoaded } = state;

  return {
    categoriesList,
    selectedCategories,
    updateSelectedCategories,
    isInitializeDataLoaded,
  };
};
