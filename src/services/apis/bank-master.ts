import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, BankArrayResponse } from '@services/types';

const BankMasterApi = (ctx: ServiceContext) => {
  return {
    /**
     * get provinces master
     */
    getBanks: async (): Promise<BankArrayResponse> => {
      const response = await isofetch(ctx, 'GET', '/bank-master', { query: { per_page: 1000 } });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default BankMasterApi;
