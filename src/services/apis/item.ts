import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import {
  throwIfError,
  EditItemRequest,
  CreateItemRequest,
  ItemResponse,
  ItemArrayResponse,
  GetItemParams,
  SearchItemParams,
  SearchItemArrayResponse,
  GetItemsParams,
  ReportItemRequest,
} from '@services/types';

const ItemApi = (ctx: ServiceContext) => {
  return {
    createItem: async (data: CreateItemRequest): Promise<ItemResponse> => {
      const response = await isofetch(ctx, 'POST', '/items', {
        body: JSON.stringify(data),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    editItem: async (hashId: string, data: EditItemRequest): Promise<ItemResponse> => {
      const response = await isofetch(ctx, 'PATCH', `/items/${hashId}`, {
        body: JSON.stringify(data),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    getItem: async (hashId: string): Promise<ItemResponse> => {
      const response = await isofetch(ctx, 'GET', `/items/${hashId}`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    getItems: async (params: GetItemsParams): Promise<[ItemArrayResponse, number]> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/items`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        query: { ...rest, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      const count = Number.parseInt(response.headers.get('x-total-count'));

      return [resJson, count];
    },
    deleteItem: async (hashId: string): Promise<void> => {
      const response = await isofetch(ctx, 'DELETE', `/items/${hashId}`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    submitItem: async (hashId: string): Promise<{ message: string }> => {
      const response = await isofetch(ctx, 'POST', `/items/${hashId}/submit`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    getMyItems: async (params: GetItemParams): Promise<[ItemArrayResponse, number]> => {
      const { perPage, status: statusParam, ...rest } = params;
      const status = Array.isArray(statusParam) ? statusParam.join(',') : statusParam;
      const response = await isofetch(ctx, 'GET', `/users/me/items`, {
        headers: { Accept: 'application/json' },
        query: { ...rest, status, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      const count = Number.parseInt(response.headers.get('x-total-count'));

      return [resJson, count];
    },
    getRecentItems: async (page?: number, perPage?: number): Promise<ItemArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/items/recent`, {
        headers: { Accept: 'application/json' },
        query: { page, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    search: async (params: SearchItemParams): Promise<[SearchItemArrayResponse, number]> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/items/search`, {
        headers: { Accept: 'application/json' },
        query: { ...rest, per_page: perPage },
      });

      const resJson = await response.json();

      throwIfError(resJson);

      return [resJson, Number(response.headers.get('x-total-count')) || 0];
    },
    reportItem: async (data: ReportItemRequest): Promise<ItemResponse> => {
      const response = await isofetch(ctx, 'POST', `/fraud-reports`, {
        body: JSON.stringify(data),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    getVipItems: async (page?: number, perPage?: number): Promise<ItemArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/items/vip`, {
        headers: { Accept: 'application/json' },
        query: { page, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    getEstimatedCount: async (): Promise<number> => {
      const response = await isofetch(ctx, 'GET', `/items/estimated-count`, {
        headers: { Accept: 'application/json' },
      });

      const resJson = await response.json();

      throwIfError(resJson);

      return resJson?.count ?? 0;
    },
  };
};

export default ItemApi;
