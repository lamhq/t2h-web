import React from 'react';
import { ProvinceArrayResponse } from '@services/types';
import { safeKey } from '@common/utils/functions';
import { ProvinceMasterApi } from '@services/apis';

export interface ProvinceMasterHooksState {
  regionNames: string[];
  // English Region name to ProvinceArrayResponse
  regionNameToProvinces: { [key: string]: ProvinceArrayResponse };
}

export const useProvinceMaster = (provinceMasterApi: ReturnType<typeof ProvinceMasterApi>) => {
  const [state, setState] = React.useState<ProvinceMasterHooksState>({
    regionNames: [],
    regionNameToProvinces: {},
  });

  React.useEffect(() => {
    (async () => {
      const provinces = await provinceMasterApi.getProvinces({ page: 1, perPage: 100 });
      const regionNameSet = new Set<string>();
      const regionNameToProvinces: { [key: string]: ProvinceArrayResponse } = {};

      provinces.forEach((province) => {
        regionNameSet.add(province.englishRegion);

        if (province.englishRegion in regionNameToProvinces) {
          regionNameToProvinces[safeKey(province.englishRegion)].push(province);
        } else {
          regionNameToProvinces[safeKey(province.englishRegion)] = [province];
        }
      });
      const regionNames = Array.from(regionNameSet);

      return setState({ regionNames, regionNameToProvinces });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
