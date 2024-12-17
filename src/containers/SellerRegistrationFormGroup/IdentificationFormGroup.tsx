import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { NestDataObject, FieldError, Controller } from 'react-hook-form';
import { CreateSellerApplicationRequest } from '@services/types';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Text } from '@components/atoms/Text';
import InputText from '@components/molecules/InputText';
import FormOutline from '@components/molecules/FormOutline';
import InputImageController from '@components/organisms/InputImageController';
import Dropdown, { DropdownItem } from '@components/molecules/Dropdown';
import { ID_CARD_OPTIONS } from '@constants/formdata';
import { isThaiNationalIdValid, isPassportNumberValid } from '@common/utils/validation';
import { InputThaiNationalId } from '@components/molecules/InputNumber';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import FormHelper from '@components/molecules/FormHelper';

interface IdentificationFormGroupProps extends WithTranslation {
  errors: NestDataObject<CreateSellerApplicationRequest, FieldError>;
  idCardType: DropdownItem['value'];
  control: any;
  getValues: Function;
}

const IdentificationFormGroup = React.forwardRef((props: IdentificationFormGroupProps, register: any) => {
  const { t, errors, idCardType, control, getValues } = props;

  return (
    <React.Fragment>
      <FormGroup>
        <ResponsiveFormItem>
          <FormOutline outline={t(`Identification`)} />
          <FormControl mt={3}>
            <Text my={0} variant="small">
              {t(`Identification Type`)}
            </Text>
            <Controller
              as={<Dropdown options={ID_CARD_OPTIONS} isLeftIconVisible={false} />}
              name="idCardType"
              control={control}
              onChange={(changes) => changes[0]?.value}
            />
          </FormControl>
          <FormControl mt={3}>
            {idCardType === 'nationalId' && (
              <InputThaiNationalId
                ref={register({
                  required: { value: false, message: `${t('Thai National ID')} ${t('is required')}` },
                  validate: (value) => {
                    if (idCardType === 'nationalId' && !isThaiNationalIdValid(value)) {
                      return t('Please input National ID with correct format');
                    }

                    return true;
                  },
                })}
                label={t('ID number')}
                name="nationalId"
                hasError={!!errors.nationalId}
                helperText={errors.nationalId && t(errors.nationalId.message.toString())}
              />
            )}
            {idCardType === 'passport' && (
              <InputText
                ref={register({
                  required: { value: false, message: `Passport Number ${t('is required')}` },
                  validate: (value) => {
                    if (idCardType === 'passport' && !isPassportNumberValid(value)) {
                      return t('Please input Passport Number with correct format');
                    }

                    return true;
                  },
                  maxLength: 20,
                })}
                type="text"
                label={t('Passport Number')}
                name="passportNo"
                maxLength={13}
                hasError={!!errors.passportNo}
                helperText={errors.passportNo && t(errors.passportNo.message.toString())}
              />
            )}
          </FormControl>
        </ResponsiveFormItem>
      </FormGroup>

      <FormGroup>
        <ResponsiveFormContainer>
          <ResponsiveFormItem>
            <FormOutline outline={t(`Photo of your ID card`)} />
            <FormControl mt={3}>
              <Controller
                as={<InputImageController defaultImages={getValues('idImageFile') ? [getValues('idImageFile')] : []} maximumNumber={1} />}
                name="idImageFile"
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
              linkUrl="/static/images/sample/thai-id-sample.jpeg"
              imageUrl="/static/images/sample/thai-id-sample.jpeg"
            />
          </ResponsiveFormDescription>
        </ResponsiveFormContainer>
      </FormGroup>
    </React.Fragment>
  );
});

IdentificationFormGroup.displayName = 'IdentificationFormGroup';

export default withTranslation('common', { withRef: true })(IdentificationFormGroup);
