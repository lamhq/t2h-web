import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, MessageResponse, SocialProviderType } from '@services/types';

const AuthenticateProviderApi = (ctx: ServiceContext) => {
  return {
    /**
     * Disconnect social account from account
     * @param provider - Provider Type
     */
    disconnectSocialAccount: async (provider: SocialProviderType): Promise<MessageResponse> => {
      const response = await isofetch(ctx, 'POST', `/auth/social-token/disconnect`, {
        body: JSON.stringify({ provider }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default AuthenticateProviderApi;
