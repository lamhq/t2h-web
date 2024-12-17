import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import {
  throwIfError,
  UpdateSellerApplicationRequest,
  CreateSellerApplicationRequest,
  SellerApplicationResponse,
  SellerApplicationArrayResponse,
  GetSellerApplicationsParams,
} from '@services/types';

const SellerApplicationApi = (ctx: ServiceContext) => {
  return {
    /**
     * Create new SellerApplication
     * @param data - Partial<CreateSellerApplicationRequest>
     */
    createApplication: async (data: Partial<CreateSellerApplicationRequest>): Promise<SellerApplicationResponse> => {
      const response = await isofetch(ctx, 'POST', '/seller-applications', {
        body: JSON.stringify(data),
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
     * Update SellerApplication
     * @param hashId - ID of Seller Application
     * @param data - UpdateSellerApplicationRequest
     */
    updateApplication: async (hashId: string, data: Partial<UpdateSellerApplicationRequest>): Promise<UpdateSellerApplicationRequest> => {
      const response = await isofetch(ctx, 'PATCH', `/seller-applications/${hashId}`, {
        body: JSON.stringify(data),
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
     * Submit SellerApplication and wait for admin approval
     * @param hashId - ID of Seller Application
     */
    submitApplication: async (hashId: string): Promise<UpdateSellerApplicationRequest> => {
      const response = await isofetch(ctx, 'POST', `/seller-applications/${hashId}/submit`, {
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
     * Get application data by application id
     * @param hashId - Application ID
     */
    getApplication: async (hashId: string): Promise<SellerApplicationResponse> => {
      const response = await isofetch(ctx, 'GET', `/seller-applications/${hashId}`, {
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get user's applications
     * @param page - Page Number of applications
     * @param perPage - Number of Applications per page
     */
    getApplications: async (params: GetSellerApplicationsParams): Promise<SellerApplicationArrayResponse> => {
      const { perPage, ...rest } = params;
      const response = await isofetch(ctx, 'GET', `/users/me/seller-applications`, {
        headers: { Accept: 'application/json' },
        query: { per_page: perPage, ...rest },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default SellerApplicationApi;
