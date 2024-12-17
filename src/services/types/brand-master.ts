import { PaginationQueryParams } from './common';

type SearchQueryParams = Partial<{
  q: string;
}>;

export type GetBrandsParams = PaginationQueryParams & SearchQueryParams;

export interface BrandResponse {
  id: number;
  name: string;
  hashId: string;
}

export type BrandArrayResponse = BrandResponse[];
