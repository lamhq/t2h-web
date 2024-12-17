import { ItemResponse } from './item';
import { PaginationQueryParams } from './common';

export interface CreateFavoriteRequest {
  itemHashId: string;
}

export interface GetFavoriteRequest extends PaginationQueryParams {
  itemIds?: string[];
  q?: string;
}

export interface FavoriteResponse {
  createdAt: string;
  updatedAt: string;
  hashId: string;
  userHashId: string;
  itemHashId: string;
  item: ItemResponse;
}

export type FavoriteArrayResponse = FavoriteResponse[];
