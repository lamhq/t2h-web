import { createApiClient } from '@services/core';
import { SellerApplicationApi } from '@services/apis';
import { SellerApplicationResponse } from '@services/types';

export const getSellerApplication = async (ctx): Promise<SellerApplicationResponse | undefined> => {
  if (ctx.query?.hashId) {
    const sellerApplicationAPI = createApiClient(SellerApplicationApi, ctx);
    const id = Array.isArray(ctx.query.hashId) ? ctx.query.hashId[0] : ctx.query.hashId;

    return await sellerApplicationAPI.getApplication(decodeURIComponent(id));
  }

  return undefined;
};

export const getMyLatestSellerApplication = async (ctx): Promise<SellerApplicationResponse | undefined> => {
  const sellerApplicationAPI = createApiClient(SellerApplicationApi, ctx);
  const applications = await sellerApplicationAPI.getApplications({ page: 1, perPage: 1, sort: 'createdAt:DESC' });

  return applications.length > 0 ? applications[0] : undefined;
};
