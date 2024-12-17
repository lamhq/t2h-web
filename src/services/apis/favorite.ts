import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, CreateFavoriteRequest, FavoriteResponse, FavoriteArrayResponse, GetFavoriteRequest } from '@services/types';

const FavoriteApi = (ctx: ServiceContext) => {
  return {
    getFavoritesByItemHashId: async (itemHashId: string, page: number = 1, perPage: number = 10): Promise<FavoriteResponse[]> => {
      const response = await isofetch(ctx, 'GET', `/items/${itemHashId}/favorites`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        query: { page, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    createFavorite: async (data: CreateFavoriteRequest): Promise<FavoriteResponse> => {
      const response = await isofetch(ctx, 'POST', '/favorites', {
        body: JSON.stringify(data),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    deleteFavorite: async (itemHashId: string): Promise<FavoriteResponse> => {
      const response = await isofetch(ctx, 'DELETE', `/favorites/${itemHashId}`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get my favorites
     * @param page - page of boosts
     * @param perPage - number of recodes per page
     */
    getMyFavorites: async (query: GetFavoriteRequest): Promise<[FavoriteArrayResponse, number]> => {
      const { itemIds, perPage, ...others } = query;
      const response = await isofetch(ctx, 'POST', `/users/me/favorites`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds }),
        query: { ...others, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      const count = Number.parseInt(response.headers.get('x-total-count'));

      return [resJson, count];
    },
  };
};

export default FavoriteApi;
