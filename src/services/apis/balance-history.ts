import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, BalanceHistoryArrayResponse } from '@services/types';
import { PaginationQueryParams } from '@services/types/common';

const BalanceHistoryApi = (ctx: ServiceContext) => {
  return {
    /**
     * get user's balance histories
     */
    getBalanceHistories: async (params: PaginationQueryParams = {}): Promise<[BalanceHistoryArrayResponse, number]> => {
      const { perPage = 20, ...rest } = params;
      const response = await isofetch(ctx, 'GET', '/users/me/balance-histories', { query: { per_page: perPage, ...rest } });
      const resJson = await response.json();

      throwIfError(resJson);

      return [resJson, Number(response.headers.get('x-total-count')) || 0];
    },
  };
};

export default BalanceHistoryApi;
