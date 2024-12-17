import React, { useState, useEffect, useCallback } from 'react';
import { Controller, Control, ValidationValueMessage } from 'react-hook-form';
import { withTranslation } from '@server/i18n';
import { WithTranslation } from 'react-i18next';
import { ProvinceArrayResponse } from '@services/types';
import InputTextDropdown from '@components/molecules/InputTextDropdown';
import { ProvinceMasterApi } from '@services/apis';
import { useAuthContext } from '@hocs/withAuth';
import { safeKey } from '@common/utils';

interface ProvinceInputTextDropdownControlerProps extends WithTranslation {
  provinceApi: ReturnType<typeof ProvinceMasterApi>;
  provinces?: ProvinceArrayResponse;
  name: string;
  defaultValue: string;
  control: Control<Record<string, any>>;
  label: string;
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

const ProvinceInputTextDropdownControler: React.FC<ProvinceInputTextDropdownControlerProps> = (
  props: ProvinceInputTextDropdownControlerProps,
) => {
  const { provinceApi, provinces = [], name, defaultValue, label, control, errors, rules, t } = props;
  const user = useAuthContext();
  const transformToProvinceOptions = useCallback(
    (provinces: ProvinceArrayResponse) => {
      return [...(user.province?.length > 0 ? [user.province] : []), ...provinces.map((p) => `${p.thaiName} / ${p.englishName}`)];
    },
    [user],
  );
  const [defaultProvinceOptions, setDefaultProvinceOptions] = useState(transformToProvinceOptions(provinces));
  const [provinceOptions, setProvinceOptions] = useState(defaultProvinceOptions);

  useEffect(() => {
    const fetchProvinceMaster = async () => {
      const provinces = await provinceApi.getProvinces({ page: 1, perPage: 1000 });
      const provinceOptions = transformToProvinceOptions(provinces);

      setDefaultProvinceOptions(provinceOptions);
      setProvinceOptions(provinceOptions);
    };

    fetchProvinceMaster();
  }, [provinceApi, transformToProvinceOptions]);

  return (
    <Controller
      as={
        <InputTextDropdown
          name={name}
          items={provinceOptions}
          defaultValue={defaultValue}
          label={label}
          hasError={!!errors[safeKey(name)]}
          helperText={errors[safeKey(name)] && t(errors[safeKey(name)].message.toString())}
        />
      }
      name={name}
      control={control}
      onChange={(changes) => {
        if (changes.length > 0) {
          const targetValue = changes[0].target.value;

          setProvinceOptions(defaultProvinceOptions.filter((v) => v.toLowerCase().includes(targetValue.toLowerCase())));

          return changes[0].target.value;
        } else {
          setProvinceOptions(defaultProvinceOptions);

          return undefined;
        }
      }}
      defaultValue={defaultValue}
      rules={rules}
    />
  );
};

ProvinceInputTextDropdownControler.displayName = 'ProvinceInputTextDropdownControler';

ProvinceInputTextDropdownControler.defaultProps = {
  provinces: [],
};

export default withTranslation('common')(ProvinceInputTextDropdownControler);
