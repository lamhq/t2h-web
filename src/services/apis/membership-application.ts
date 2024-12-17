import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, UserResponse } from '@services/types';

export enum MembershipType {
  Basic = 'basic',
  Pro = 'pro',
  Silver = 'silver',
  Gold = 'gold',
  Premium = 'premium',
}

export enum ApplicationStatus {
  Pending = 'pending',
  Submitted = 'submitted',
  Approved = 'approved',
  Draft = 'draft',
  Rejected = 'rejected',
}

export interface MembershipApplicationRequest {
  membershipType: MembershipType;
  homeOwner: string;
  purchasedDate: string;
  address: string;
  guarantorFileHashId: string;
  houseRegistrationFileHashId: string;
}

export interface MembershipApplication {
  status: ApplicationStatus;
  membershipType: MembershipType;
  homeOwner: string;
  purchasedDate: string;
  address: string;
  user: UserResponse;
  hashId: string;
  userHashId: string;
}

const MembershipApplicationApi = (ctx: ServiceContext) => {
  return {
    /**
     * Create new MembershipApplication
     * @param data - Partial<CreateSellerApplicationRequest>
     */
    createApplication: async (data: MembershipApplicationRequest): Promise<MembershipApplication> => {
      const response = await isofetch(ctx, 'POST', '/membership-applications', {
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
     * Get application data by application id
     * @param hashId - Application ID
     */
    getApplication: async (hashId: string): Promise<MembershipApplication> => {
      const response = await isofetch(ctx, 'GET', `/membership-applications/${hashId}`, {
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
     * @param status - Application status
     */
    getApplications: async (page: number = 1, perPage: number = 10, status: ApplicationStatus): Promise<MembershipApplication[]> => {
      const response = await isofetch(ctx, 'GET', `/users/me/membership-applications`, {
        headers: { Accept: 'application/json' },
        query: { page, per_page: perPage, status },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default MembershipApplicationApi;
