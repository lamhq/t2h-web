import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import { useUserForm } from '@services/hooks/user';
import { UserApi } from '@services/apis';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import Flex from '@components/layouts/Flex';
import Box from '@components/layouts/Box';
import InputImage from '@components/molecules/InputImage';
import LetterAvatar from '@components/atoms/LetterAvatar';

interface ProfileImageEditFormProps extends WithTranslation {
  userApi: ReturnType<typeof UserApi>;
  recaptcha: string;
}

const BlankAvatarWrapper = styled.div`
  display: none;
`;

const ProfileImageEditForm: React.FC<ProfileImageEditFormProps> = ({ userApi, t, recaptcha }: ProfileImageEditFormProps) => {
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const formRef = useRef<HTMLFormElement>();

  const { user, form, requestStatus } = useUserForm({
    apiClient: userApi,
    recaptcha,
  });
  const { control, handleUserSubmit, reset } = form;

  const onCanvasReady = React.useCallback(
    (imgDataURL: any) => {
      reset({ profileImage: { src: imgDataURL } });
    },
    [reset],
  );

  useEffect(() => {
    setGlobalSpinner(requestStatus.isLoading);
  }, [setGlobalSpinner, requestStatus.isLoading]);

  useEffect(() => {
    if (requestStatus.error) {
      setGlobalSnackbar({ message: t(requestStatus.error.message), variant: 'error' });
    }
  }, [t, setGlobalSnackbar, requestStatus.error]);

  return (
    <form ref={formRef} onSubmit={handleUserSubmit}>
      <Flex flexWrap="wrap">
        <Box mx="auto" mt={3}>
          <Controller
            as={<InputImage name="profileImage" />}
            name="profileImage"
            control={control}
            onChange={(changes) => {
              const data = changes.length > 0 ? changes[0] : undefined;

              // Submit when chaning images
              if (data.file) {
                setTimeout(() => {
                  formRef.current.dispatchEvent(new Event('submit'));
                }, 100);
              }

              return data;
            }}
          />
          {user.profileImageUrl ? (
            ''
          ) : (
            <BlankAvatarWrapper>
              <LetterAvatar onCanvasReady={onCanvasReady} firstName={user.firstName} lastName={user.lastName} width={100} height={100} />
            </BlankAvatarWrapper>
          )}
        </Box>
      </Flex>
    </form>
  );
};

ProfileImageEditForm.displayName = 'ProfileImageEditForm';

export default withTranslation('common')(ProfileImageEditForm);
