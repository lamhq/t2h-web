import { PaginationQueryParams } from './common';

type SearchQueryParams = Partial<{
  q: string;
  region: string;
  language: string;
}>;

export type GetProvincesParams = PaginationQueryParams & SearchQueryParams;

export interface ProvinceResponse {
  thaiName: string;
  englishName: string;
  thaiRegion: string;
  englishRegion: string;
  hashId: string;
}

export type ProvinceArrayResponse = ProvinceResponse[];
