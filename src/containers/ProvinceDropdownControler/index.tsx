import React, { useState, useEffect, useCallback } from 'react';
import { Controller, Control, ValidationValueMessage } from 'react-hook-form';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { ProvinceArrayResponse } from '@services/types';
import { ProvinceMasterApi } from '@services/apis';
import { safeKey } from '@common/utils';
import Dropdown from '@components/molecules/Dropdown';

interface ProvinceDropdownControlerProps extends WithTranslation {
  provinceApi: ReturnType<typeof ProvinceMasterApi>;
  provinces?: ProvinceArrayResponse;
  name: string;
  defaultValue: string;
  control: Control<Record<string, any>>;
  errors: any;
  rules: Partial<{
    required:
      | string
      | boolean
      | React.ReactElement<
          any,
          | string
          | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null)
          | (new (props: any) => React.Component<any, any, any>)
        >
      | ValidationValueMessage<boolean>;
  }>;
}

const ProvinceDropdownControler: React.FC<ProvinceDropdownControlerProps> = (props: ProvinceDropdownControlerProps) => {
  const { provinceApi, provinces = [], name, defaultValue, rules, control, errors } = props;
  const transformToProvinceOptions = useCallback((provinces: ProvinceArrayResponse) => {
    return [
      { label: '-', value: null },
      ...provinces.map((p) => ({
        label: `${p.thaiName} / ${p.englishName}`,
        value: p.hashId,
        group: `${p.thaiRegion} / ${p.englishRegion}`,
      })),
    ];
  }, []);
  const [provinceOptions, setProvinceOptions] = useState(transformToProvinceOptions(provinces));

  useEffect(() => {
    const fetchProvinceMaster = async () => {
      const provinces = await provinceApi.getProvinces({ page: 1, perPage: 1000 });

      setProvinceOptions(transformToProvinceOptions(provinces));
    };

    fetchProvinceMaster();
  }, [provinceApi, transformToProvinceOptions]);

  return (
    <Controller
      as={
        <Dropdown
          name={name}
          options={provinceOptions}
          groupOrders={['ภาคกลาง / The Central']}
          hasError={!!errors[safeKey(name)]}
          defaultValue={defaultValue}
        />
      }
      name={name}
      control={control}
      onChange={(changes) => {
        return changes.length > 0 ? changes[0].value : undefined;
      }}
      rules={rules}
    />
  );
};

ProvinceDropdownControler.displayName = 'ProvinceDropdownControler';

ProvinceDropdownControler.defaultProps = {
  provinces: [],
};

export default withTranslation('common')(ProvinceDropdownControler);
