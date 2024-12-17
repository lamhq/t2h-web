import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError } from '@services/types';
import { NotificationArrayResponse } from '@services/types/notification';

const NotificationApi = (ctx: ServiceContext) => {
  return {
    /**
     * Get user's notifications
     * @param page - Page Number of applications
     * @param perPage - Number of Applications per page
     */
    getMyNotifications: async (page: number = 1, perPage: number = 10): Promise<NotificationArrayResponse> => {
      const response = await isofetch(ctx, 'GET', `/users/me/notifications`, {
        headers: { Accept: 'application/json' },
        query: { page, per_page: perPage },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default NotificationApi;
