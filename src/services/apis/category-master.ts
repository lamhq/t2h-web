import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, GetCategoriesParams, CategoryArrayResponse, CategoryResponse } from '@services/types';

const CategoryMasterApi = (ctx: ServiceContext) => {
  return {
    /**
     * Get Categories
     * @param params - search query
     */
    getCategories: async (params: GetCategoriesParams): Promise<CategoryArrayResponse> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/category-master`, {
        headers: { Accept: 'application/json' },
        query: { ...rest, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Root Categories
     * @param params - search query
     */
    getRootCategories: async (params: GetCategoriesParams): Promise<CategoryArrayResponse> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/category-master/root`, {
        headers: { Accept: 'application/json' },
        query: { ...rest, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Category by hashId
     * @param hashId - hashId of category
     */
    getCategoryByHashId: async (hashId: string): Promise<CategoryResponse> => {
      const response = await isofetch(ctx, 'GET', `/category-master/${hashId}`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Sub categories belonged to the parent category with given hash id
     * @param hashId - hashId of parent category
     */
    getSubCategories: async (hashId: string): Promise<CategoryArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/category-master/${hashId}/children`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default CategoryMasterApi;
