import React from 'react';
import { withTranslation } from '@server/i18n';
import { WithTranslation, TFunction } from 'next-i18next';
import { NestDataObject, FieldError, Controller, Control } from 'react-hook-form';
import { CreateSellerApplicationRequest } from '@services/types';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import { Text } from '@components/atoms/Text';
import InputText from '@components/molecules/InputText';
import { HelpOutlineIcon } from '@components/atoms/IconButton';
import FormOutline from '@components/molecules/FormOutline';
import InputImageController from '@components/organisms/InputImageController';
import Dropdown, { DropdownItem } from '@components/molecules/Dropdown';
import { DEDUCTING_WITHHOLDING_TAX_OPTIONS } from '@constants/formdata';
import { isTaxIdValid } from '@common/utils/validation';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import FormHelper from '@components/molecules/FormHelper';

interface CompanyFormGroupProps extends WithTranslation {
  t: TFunction;
  control: Control<any>;
  getValues: Function;
  errors: NestDataObject<CreateSellerApplicationRequest, FieldError>;
  deductTaxType: DropdownItem['value'];
}

const CompanyFormGroup = React.forwardRef((props: CompanyFormGroupProps, register: any) => {
  const { t, control, getValues, errors, deductTaxType } = props;

  return (
    <React.Fragment>
      <FormGroup mt={0}>
        <ResponsiveFormItem>
          <FormOutline outline={t(`Company info`)} icon={<HelpOutlineIcon size="16px" color="helpIcon" />} />
          <FormControl mt={3}>
            <InputText
              ref={register({
                required: { value: true, message: `${t(`Company name`)} ${t('is required')}` },
                maxLength: 255,
              })}
              type="text"
              label={t(`Registered company name`)}
              name="companyName"
              hasError={!!errors.companyName}
              helperText={errors.companyName && `${t('Company name')} ${t('is invalid')}`}
              maxLength={255}
            />
          </FormControl>
        </ResponsiveFormItem>

        <FormControl mt="17px">
          <ResponsiveFormItem>
            <InputText
              ref={register({
                required: { value: true, message: `${t(`Tax ID`)} ${t('is required')}` },
                validate: (taxId) => {
                  if (!isTaxIdValid(taxId)) {
                    return t('Please input correct format');
                  }

                  return true;
                },
                maxLength: 13,
              })}
              type="text"
              inputMode="numeric"
              label={t(`Tax ID`)}
              name="companyTaxId"
              maxLength={13}
              hasError={!!errors.companyTaxId}
              helperText={errors.companyTaxId && t(errors.companyTaxId.message.toString())}
            />
          </ResponsiveFormItem>
        </FormControl>
      </FormGroup>

      <FormGroup mt={{ _: 5, md: '40px' }}>
        <FormOutline outline={t(`Withholding Tax`)} />
        <ResponsiveFormItem mt={3}>
          <FormControl mt={0} mb={0}>
            <Text mt={0} mb={0} variant="small">
              {t(`Deduct Withholding Tax from Payment`)}
            </Text>
            <Controller
              as={<Dropdown options={DEDUCTING_WITHHOLDING_TAX_OPTIONS} isLeftIconVisible={false} />}
              name="deductTaxType"
              control={control}
              onChange={(changes) => changes[0]?.value}
            />
          </FormControl>
        </ResponsiveFormItem>
      </FormGroup>

      <FormGroup mt={{ _: 5, md: '40px' }}>
        <ResponsiveFormContainer>
          <ResponsiveFormItem>
            <FormOutline outline={t(`DBD`)} />
            <FormControl mt={3}>
              <Controller
                as={<InputImageController defaultImages={getValues('dbdImageFile') ? [getValues('dbdImageFile')] : []} maximumNumber={1} />}
                name="dbdImageFile"
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
              linkUrl="/static/images/sample/wht-sample.jpg"
              imageUrl="/static/images/sample/wht-sample.jpg"
            />
          </ResponsiveFormDescription>
        </ResponsiveFormContainer>
      </FormGroup>

      {deductTaxType === 'deduct_tax' && (
        <FormGroup>
          <ResponsiveFormContainer>
            <ResponsiveFormItem>
              <FormOutline outline={t(`Porpor20`)} />
              <FormControl mt={3}>
                <Controller
                  as={
                    <InputImageController
                      defaultImages={getValues('porpor20ImageFile') ? [getValues('porpor20ImageFile')] : []}
                      maximumNumber={1}
                    />
                  }
                  name="porpor20ImageFile"
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
                linkUrl="/static/images/sample/tax-deduct-sample.png"
                imageUrl="/static/images/sample/tax-deduct-sample.png"
              />
            </ResponsiveFormDescription>
          </ResponsiveFormContainer>
        </FormGroup>
      )}
    </React.Fragment>
  );
});

CompanyFormGroup.displayName = 'CompanyFormGroup';

export default withTranslation('common', { withRef: true })(CompanyFormGroup);
