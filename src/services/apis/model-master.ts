import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, GetModelsParams, ModelArrayResponse, ModelResponse } from '@services/types';

const ModelMasterApi = (ctx: ServiceContext) => {
  return {
    /**
     * Get Models
     * @param params - search query
     */
    getModels: async (params: GetModelsParams): Promise<ModelArrayResponse> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/model-master`, {
        headers: { Accept: 'application/json' },
        query: { ...rest, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Model by given hashId
     * @param hashId - model hashId
     */
    getModelByHashId: async (hashId: string): Promise<ModelResponse> => {
      const response = await isofetch(ctx, 'GET', `/model-master/${hashId}`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Model by brand hashId
     * @param hashId - model hashId
     */
    getModelsByBrandHashId: async (hashId: string): Promise<ModelArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/brand-master/${hashId}/models`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default ModelMasterApi;
