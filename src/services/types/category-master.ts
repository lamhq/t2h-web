import { PaginationQueryParams } from './common';

type SearchQueryParams = Partial<{
  name: string;
  language: string;
}>;

export type GetCategoriesParams = PaginationQueryParams & SearchQueryParams;

export interface CategoryResponse {
  thaiName: string;
  englishName: string;
  path: string;
  hashId: string;
  parentHashIds: string[];
}

export type CategoryArrayResponse = CategoryResponse[];
