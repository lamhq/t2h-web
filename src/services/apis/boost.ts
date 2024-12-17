import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, BoostResponse, BoostRequest, BoostStatus, BoostArrayResponse } from '@services/types';

const ItemApi = (ctx: ServiceContext) => {
  return {
    /**
     * Boost Item
     * @param itemHashId - item hash id
     * @param request - boost params
     */
    boostItem: async (itemHashId: string, request: BoostRequest): Promise<BoostResponse> => {
      const response = await isofetch(ctx, 'POST', `/items/${itemHashId}/boost`, {
        body: JSON.stringify(request),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Boost Item
     * @param page - page of boosts
     * @param perPage - number of recodes per page
     * @param status - Boost status to fetch
     */
    getMyBoosts: async (page?: number, perPage?: number, status?: BoostStatus): Promise<BoostArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/users/me/boosts`, {
        headers: { Accept: 'application/json' },
        query: { page, per_page: perPage, status },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default ItemApi;
