import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, BrandArrayResponse, GetBrandsParams } from '@services/types';

const BrandMasterApi = (ctx: ServiceContext) => {
  return {
    /**
     * Get Brands
     * @param params - search query
     */
    getBrands: async (params: GetBrandsParams): Promise<BrandArrayResponse> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/brand-master`, {
        headers: { Accept: 'application/json' },
        query: { ...rest, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Brand with given hashId
     * @param hashId - brand hashId
     */
    getBrandByHashId: async (hashId: string): Promise<BrandArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/brand-master/${hashId}`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Brands belonged to the category with given hashId
     * @hashId params - hashId of category
     */
    getBrandsByCategoryHashId: async (hashId: string): Promise<BrandArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/category-master/${hashId}/brands`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default BrandMasterApi;
