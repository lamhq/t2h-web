import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, ProvinceArrayResponse, GetProvincesParams } from '@services/types';

const ProvinceMasterApi = (ctx: ServiceContext) => {
  return {
    /**
     * Get Provinces
     * @param params - search query
     */
    getProvinces: async (params: GetProvincesParams): Promise<ProvinceArrayResponse> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/province-master`, {
        headers: { Accept: 'application/json' },
        query: { ...rest, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Province with given hashId
     * @param hashId - brand hashId
     */
    getProvinceByHashId: async (hashId: string): Promise<ProvinceArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/province-master/${hashId}`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default ProvinceMasterApi;
