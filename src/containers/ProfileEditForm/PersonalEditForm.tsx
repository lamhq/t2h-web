import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { useUserForm } from '@services/hooks/user';
import { UserApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import EditableFormGroup from '@components/molecules/EditableFormGroup';
import Flex from '@components/layouts/Flex';
import { SubTitle } from '@components/atoms/Title';
import { TextLink } from '@components/atoms/Text';
import EditableFormControl from '@components/molecules/EditableFormControl';
import InputText from '@components/molecules/InputText';
import FlashMessage from '@components/molecules/FlashMessage';
import Box from '@components/layouts/Box';
import { Button } from '@components/atoms/Button';
import { checkUsernameAvailability, checkEmailAvailability } from '@services/facades/user';
import { isValidUrl } from '@common/utils/validation';

const EditTextLinkWrapper = styled.div``;

interface PersonalEditFormProps extends WithTranslation {
  userApi: ReturnType<typeof UserApi>;
  recaptcha: string;
}

const PersonalEditForm: React.FC<PersonalEditFormProps> = ({ userApi, recaptcha, t }: PersonalEditFormProps) => {
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [isFlashMessageVisible, setIsFlashMessageVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const { user, form, requestStatus } = useUserForm({
    apiClient: userApi,
    recaptcha,
    beforeSubmit: () => {
      setIsEditable(false);
      setIsFlashMessageVisible(true);
    },
  });
  const { register, handleUserSubmit, getValues, revertUserForm, errors } = form;

  const handleEditLinkClick = useCallback(() => {
    setIsEditable(!isEditable);
    revertUserForm();
  }, [isEditable, revertUserForm]);

  const handleClose = useCallback(() => {
    setIsFlashMessageVisible(false);
  }, []);

  useEffect(() => {
    setGlobalSpinner(requestStatus.isLoading);
  }, [setGlobalSpinner, requestStatus.isLoading]);

  useEffect(() => {
    if (requestStatus.error) {
      setGlobalSnackbar({ message: t(requestStatus.error.message), variant: 'error' });
    }
  }, [t, setGlobalSnackbar, requestStatus.error]);

  return (
    <form onSubmit={handleUserSubmit}>
      <EditableFormGroup>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <SubTitle>{t('Personal')}</SubTitle>
          <EditTextLinkWrapper>
            <TextLink onClick={handleEditLinkClick}>{t('Edit')}</TextLink>
          </EditTextLinkWrapper>
        </Flex>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText
            ref={register({
              required: { value: true, message: `${t(`Username`)} ${t('is required')}` },
              validate: async (username) => {
                try {
                  if (username === user.username) {
                    return true;
                  }

                  const { isAvailable, message } = await checkUsernameAvailability(userApi, username);

                  if (isAvailable) {
                    return isAvailable;
                  }

                  return t(message).toString();
                } catch (err) {
                  setGlobalSnackbar({ message: t(err.message), variant: 'error' });

                  return true;
                }
              },
            })}
            type="text"
            name="username"
            label={t('Username')}
            hasError={!!errors.username}
            helperText={errors.username && t(errors.username.message.toString())}
          />
        </EditableFormControl>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText
            ref={register({ required: { value: true, message: `${t(`First name`)} ${t('is required')}` } })}
            type="text"
            name="firstName"
            label={t('First name')}
            hasError={!!errors.firstName}
            helperText={errors.firstName && `${t(`First name`)} ${t('is required')}`}
          />
        </EditableFormControl>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText
            ref={register({ required: { value: true, message: `${t(`Last name`)} ${t('is required')}` } })}
            type="text"
            name="lastName"
            label={t('Last name')}
            hasError={!!errors.lastName}
            helperText={errors.lastName && `${t(`Last name`)} ${t('is required')}`}
          />
        </EditableFormControl>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText
            ref={register({ required: { value: true, message: `${t(`Display name`)} ${t('is required')}` } })}
            type="text"
            name="displayName"
            label={t('Display Name')}
            helperText={errors.lastName && `${t(`Display Name`)} ${t('is required')}`}
          />
        </EditableFormControl>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText
            ref={register({
              validate: async (personalWebHomepage) => {
                if (personalWebHomepage && !isValidUrl(personalWebHomepage)) {
                  return t('Please input correct format').toString();
                }
              },
            })}
            type="text"
            label={t(`Homepage URL`)}
            name="personalWebHomepage"
            hasError={!!errors.personalWebHomepage}
            helperText={errors.personalWebHomepage && t(errors.personalWebHomepage.message.toString())}
          />
        </EditableFormControl>
        <EditableFormControl getValues={getValues} isEditable={isEditable}>
          <InputText
            ref={register({
              required: { value: true, message: `${t(`Email`)} ${t('is required')}` },
              validate: async (email) => {
                try {
                  if (email === user.email) {
                    return true;
                  }

                  const { isAvailable, message } = await checkEmailAvailability(userApi, email);

                  if (isAvailable) {
                    return isAvailable;
                  }

                  return t(message).toString();
                } catch (err) {
                  setGlobalSnackbar({ message: t(err.message), variant: 'error' });

                  return true;
                }
              },
            })}
            type="text"
            name="email"
            label={t('Email')}
            hasError={!!errors.email}
            helperText={errors.email && t(errors.email.message.toString())}
          />
        </EditableFormControl>
        <FlashMessage mb={2} variant="success" isVisible={isFlashMessageVisible} onClose={handleClose}>
          {t('Your profile has been updated')}
        </FlashMessage>
        {isEditable && (
          <React.Fragment>
            <Box mb={2}>
              <Button type="submit" variant="primary">
                {t('Update')}
              </Button>
            </Box>
            <Box>
              <Button type="submit" variant="transparent" onClick={handleEditLinkClick}>
                {t('Cancel')}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </EditableFormGroup>
    </form>
  );
};

PersonalEditForm.displayName = 'PersonalEditForm';

export default withTranslation('common')(PersonalEditForm);
