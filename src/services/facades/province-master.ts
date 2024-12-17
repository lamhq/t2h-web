import { GetServerSidePropsContext } from 'next';
import { createApiClient } from '@services/core';
import { ProvinceMasterApi } from '@services/apis';
import { ProvinceArrayResponse } from '@services/types';

export const getProvinceMaster = async (ctx: GetServerSidePropsContext<{}>): Promise<ProvinceArrayResponse> => {
  const provinceAPI = createApiClient(ProvinceMasterApi, ctx);

  return await provinceAPI.getProvinces({});
};
