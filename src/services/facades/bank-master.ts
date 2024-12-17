import { GetServerSidePropsContext } from 'next';
import { createApiClient } from '@services/core';
import { BankMasterApi } from '@services/apis';
import { BankArrayResponse } from '@services/types';

export const getBankMaster = async (ctx: GetServerSidePropsContext<{}>): Promise<BankArrayResponse> => {
  const bankAPI = createApiClient(BankMasterApi, ctx);

  return await bankAPI.getBanks();
};
