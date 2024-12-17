import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { FormControl, FormGroup } from '@components/layouts/FormGroup';
import FormOutline from '@components/molecules/FormOutline';
import InputImageController from '@components/organisms/InputImageController';
import { ResponsiveFormContainer, ResponsiveFormItem, ResponsiveFormDescription } from '@components/layouts/ResponsiveFormBox';
import FormHelper from '@components/molecules/FormHelper';

interface SelfieFormGroupProps extends WithTranslation {
  control: any;
  getValues: Function;
}

const SelfieFormGroup = (props: SelfieFormGroupProps) => {
  const { t, control, getValues } = props;

  return (
    <FormGroup>
      <ResponsiveFormContainer>
        <ResponsiveFormItem>
          <FormOutline outline={t(`Selfie with your ID card`)} />
          <FormControl mt={3}>
            <Controller
              rules={{
                required: { value: true, message: `${t('Images')} ${t('is required')}` },
              }}
              as={
                <InputImageController
                  defaultImages={getValues('selfieImageFile') ? [getValues('selfieImageFile')] : []}
                  maximumNumber={1}
                />
              }
              name="selfieImageFile"
              control={control}
              onChange={(changes) => {
                return changes.length > 0 ? changes[0][0] : undefined;
              }}
            />
          </FormControl>
        </ResponsiveFormItem>
        <ResponsiveFormDescription>
          {/* TODO: open dialog for mobile */}
          {/* TODO: change proper image for explanation */}
          <FormHelper
            description={t(`Please take a clear making sure to avoid blury images and reflections.`)}
            linkText={t(`See example`)}
            linkUrl="/static/images/sample/selfie-idcard-sample.jpg"
            imageUrl="/static/images/sample/selfie-idcard-sample.jpg"
          />
        </ResponsiveFormDescription>
      </ResponsiveFormContainer>
    </FormGroup>
  );
};

SelfieFormGroup.displayName = 'SelfieFormGroup';

export default withTranslation('common', { withRef: true })(SelfieFormGroup);
