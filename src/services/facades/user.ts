import { UserApi } from '@services/apis';
import { isUsernameValid, isEmailValid } from '@common/utils/validation';

export const checkUsernameAvailability = async (
  userApi: ReturnType<typeof UserApi>,
  username: string,
): Promise<{ isAvailable: boolean; message: string }> => {
  if (!isUsernameValid(username)) {
    return { isAvailable: false, message: 'Please input correct format' };
  }

  const result = await userApi.checkAvailability({ username });

  if (result['username'].check) {
    return { isAvailable: true, message: null };
  }

  return { isAvailable: false, message: result['username'].message };
};

export const checkEmailAvailability = async (
  userApi: ReturnType<typeof UserApi>,
  email: string,
): Promise<{ isAvailable: boolean; message: string }> => {
  if (!isEmailValid(email)) {
    return { isAvailable: false, message: 'Please input correct format' };
  }

  const result = await userApi.checkAvailability({ email });

  if (result['email'].check) {
    return { isAvailable: true, message: null };
  }

  return { isAvailable: false, message: result['email'].message };
};
