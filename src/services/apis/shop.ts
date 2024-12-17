import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, ShopResponse, ShopRequest } from '@services/types';

const ShopApi = (ctx: ServiceContext) => {
  return {
    /**
     * Get user's shops
     * @param userHashId - string
     * @param page - number
     * @param perPage - number
     */
    getShopByUserHashId: async (userHashId: string): Promise<ShopResponse> => {
      const response = await isofetch(ctx, 'GET', `/shops`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        query: { userHashId },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get shop by hashId
     * @param hashId - string
     */
    getShopsByHashId: async (hashId: string): Promise<ShopResponse> => {
      const response = await isofetch(ctx, 'GET', `/shops/${hashId}`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Update shop
     * @param hashId - string
     * @param data - ShopRequest
     */
    updateShop: async (hashId: string, data: ShopRequest): Promise<ShopResponse> => {
      const response = await isofetch(ctx, 'PATCH', `/shops/${hashId}`, {
        body: JSON.stringify(data),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default ShopApi;
