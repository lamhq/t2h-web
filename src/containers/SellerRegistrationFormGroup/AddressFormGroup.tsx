import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Controller, Control } from 'react-hook-form';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import FormOutline from '@components/molecules/FormOutline';
import InputImageController from '@components/organisms/InputImageController';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import FormHelper from '@components/molecules/FormHelper';
import { Text } from '@components/atoms/Text';
import InputText from '@components/molecules/InputText';
import { ProvinceMasterApi } from '@services/apis';
import ProvinceDropdownControler from '@containers/ProvinceDropdownControler';
import InputHelperText from '@components/atoms/InputHelperText';

interface AddressFormGroupProps extends WithTranslation {
  ref: any;
  errors: any;
  provinceApi: ReturnType<typeof ProvinceMasterApi>;
  control: Control<any>;
  getValues: Function;
}

const AddressFormGroup: React.FC<AddressFormGroupProps> = React.forwardRef((props: AddressFormGroupProps, register: any) => {
  const { t, provinceApi, errors, control, getValues } = props;

  return (
    <React.Fragment>
      <FormGroup>
        <ResponsiveFormItem>
          <FormOutline outline={t(`Address`)} />
          <FormControl mt={3}>
            <Text my={0} variant="small">
              {t(`Province`)}
            </Text>
            <ProvinceDropdownControler
              provinceApi={provinceApi}
              name="provinceHashId"
              control={control}
              defaultValue={getValues('provinceHashId')}
              errors={errors}
              rules={{
                required: { value: true, message: `${t(`Province`)} ${t('is required')}` },
              }}
            />
            {errors.provinceHashId && <InputHelperText hasError={true}>{t(errors.provinceHashId.message)}</InputHelperText>}
          </FormControl>
          <FormControl mt={3}>
            <InputText
              ref={register({
                required: { value: true, message: `${t(`Address`)} ${t('is required')}` },
              })}
              type="text"
              label={`${t(`Address`)}`}
              name="address"
              hasError={!!errors.address}
              helperText={errors.address && `${t('Address')} ${t('is required')}`}
            />
          </FormControl>
        </ResponsiveFormItem>
      </FormGroup>
      <FormGroup>
        <ResponsiveFormContainer>
          <ResponsiveFormItem>
            <FormOutline outline={t(`Home Registration Document (Optional)`)} />
            <FormControl mt={3}>
              <Controller
                as={
                  <InputImageController
                    defaultImages={getValues('homeRegistrationDocImageFile') ? [getValues('homeRegistrationDocImageFile')] : []}
                    maximumNumber={1}
                  />
                }
                name="homeRegistrationDocImageFile"
                control={control}
                onChange={(changes) => {
                  return changes.length > 0 ? changes[0][0] : undefined;
                }}
              />
            </FormControl>
          </ResponsiveFormItem>
          <ResponsiveFormDescription>
            {/* TODO: open dialog for mobile */}
            <FormHelper
              description={t(`Please take a clear making sure to avoid blury images and reflections.`)}
              linkText={t(`See example`)}
              linkUrl="/static/images/sample/thai-home-sample.jpg"
              imageUrl="/static/images/sample/thai-home-sample.jpg"
            />
          </ResponsiveFormDescription>
        </ResponsiveFormContainer>
      </FormGroup>
    </React.Fragment>
  );
});

AddressFormGroup.displayName = 'AddressFormGroups';

export default withTranslation('common', { withRef: true })(AddressFormGroup);
