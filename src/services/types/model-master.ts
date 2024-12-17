import { PaginationQueryParams } from './common';

type SearchQueryParams = Partial<{
  name: string;
}>;

export type GetModelsParams = PaginationQueryParams & SearchQueryParams;

export interface ModelResponse {
  name: string;
  hashId: string;
  brandHashId: string;
}

export type ModelArrayResponse = ModelResponse[];
