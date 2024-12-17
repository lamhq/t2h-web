import { MessageResponse, throwIfError } from '@services/types';
import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';

const AuthApi = (ctx: ServiceContext) => {
  return {
    /**
     * Sign in and create cookie session
     * @param username - username
     * @param password - password
     */
    signIn: async (username: string, password: string): Promise<MessageResponse> => {
      const response = await isofetch({ ...ctx, useProxy: false }, 'POST', `/api/auth/token`, {
        body: {
          username,
          password,
        },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default AuthApi;
