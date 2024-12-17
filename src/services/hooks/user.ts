import { useState, useCallback } from 'react';
import { UserApi } from '@services/apis';
import { useForm } from 'react-hook-form';
import { useAuthContext, useUpdateAuthContext, AuthUser } from '@hocs/withAuth';
import { pickNotEmpty } from '@common/utils';

type EditableUserProps = Partial<
  Pick<AuthUser, 'username' | 'firstName' | 'lastName' | 'displayName' | 'email' | 'personalWebHomepage'> & {
    readonly profileImage: { src: string; file?: File };
  }
>;

interface UseUserFormProps {
  apiClient: ReturnType<typeof UserApi>;
  recaptcha: string;
  user?: AuthUser;
  beforeSubmit?: (formData: EditableUserProps) => void;
  afterSubmit?: (formData: EditableUserProps, error?: Error) => void;
}

export const useUserForm = (props: UseUserFormProps) => {
  const { user: initialUser, apiClient, recaptcha, beforeSubmit, afterSubmit } = props;
  const updateAuthUser = useUpdateAuthContext();
  const authUser = useAuthContext();
  const [user, setUser] = useState(initialUser || authUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, getValues, reset, watch, control, errors } = useForm<EditableUserProps>({
    mode: 'onChange',
    defaultValues: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      personalWebHomepage: user.personalWebHomepage,
      profileImage: user.profileImageUrl
        ? {
            src: user.profileImageUrl,
            file: null,
          }
        : undefined,
    },
  });

  const handleUserSubmit = useCallback(
    async (formData: EditableUserProps, e: React.FormEvent<HTMLFormElement>) => {
      try {
        const { profileImage, ...rest } = formData;

        e.preventDefault();
        setIsLoading(true);
        beforeSubmit && beforeSubmit(formData);

        if (profileImage && profileImage.file) {
          await apiClient.uploadProfileImage(profileImage.file);
        }

        await apiClient.updateUser(pickNotEmpty({ ...rest, recaptcha }, true));
        const user = new AuthUser(await apiClient.getMe());

        updateAuthUser(user);
        setUser(user);

        afterSubmit && afterSubmit(formData, null);
      } catch (err) {
        setError(err);

        afterSubmit && afterSubmit(formData, err);
      } finally {
        setIsLoading(false);
      }
    },
    [beforeSubmit, afterSubmit, apiClient, updateAuthUser, recaptcha],
  );

  const revertUserForm = useCallback(() => {
    reset({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      personalWebHomepage: user.personalWebHomepage,
      profileImage: user.profileImageUrl
        ? {
            src: user.profileImageUrl,
            file: null,
          }
        : undefined,
    });
  }, [user, reset]);

  return {
    user,
    requestStatus: { error, isLoading },
    form: { register, getValues, handleUserSubmit: handleSubmit(handleUserSubmit), revertUserForm, reset, watch, control, errors },
  };
};
