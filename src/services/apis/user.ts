import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import { throwIfError, MessageResponse, UserResponse, CreateUserRequest, UpdateUserRequest } from '@services/types';

const UserApi = (ctx: ServiceContext) => {
  return {
    /**
     * Get authenticated user
     */
    getMe: async (): Promise<UserResponse> => {
      const response = await isofetch(ctx, 'GET', '/users/me');
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Upload user profile Image
     * @param blob - image
     */
    uploadProfileImage: async (blob: Blob): Promise<boolean> => {
      const formData = new FormData();

      formData.append('image', blob);

      const response = await isofetch(ctx, 'POST', '/users/me/upload-profile-image', {
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Create User Account
     * @param data - user data
     */
    createUser: async (data: CreateUserRequest): Promise<UserResponse> => {
      const response = await isofetch(ctx, 'POST', '/users', { body: data });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Create User Account
     * @param data - user data
     */
    updateUser: async (data: UpdateUserRequest): Promise<UserResponse> => {
      const response = await isofetch(ctx, 'PATCH', '/users/me', { body: data });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Check availability
     * @param data - username, email, mobile
     */
    checkAvailability: async (data: Partial<{ username: string; email: string; mobile: string }>): Promise<any> => {
      const response = await isofetch(ctx, 'GET', '/users/availability', { query: data });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Send verification email
     */
    sendVerificaitionEmail: async (): Promise<MessageResponse> => {
      const response = await isofetch(ctx, 'POST', '/users/me/send-verification-email');
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * verify email with verification token
     */
    verifyEmail: async (verificationToken: string) => {
      const response = await isofetch(ctx, 'POST', '/users/me/verify-email', { body: { verificationToken } });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Recover password. Send reset password email.
     * @param data - email
     */
    recoverPassword: async (data: { email: string; recaptcha: string }): Promise<MessageResponse> => {
      const response = await isofetch(ctx, 'POST', '/users/recover-password', { body: data });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * reset password. Send reset password email.
     * @param data - new password and recovery token
     */
    resetPassword: async (data: { newPassword: string; recoveryToken: string; recaptcha: string }): Promise<{ message: string }> => {
      const response = await isofetch(ctx, 'POST', '/users/reset-password', { body: data });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Send OTP to registered user's mobile number
     */
    sendOtp: async () => {
      const response = await isofetch(ctx, 'POST', '/users/me/send-otp');
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * verify mobile registered user's mobile number with verification code
     */
    verifyMobile: async (verificationCode: string) => {
      const response = await isofetch(ctx, 'POST', '/users/me/verify-mobile', { body: { verificationCode } });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * get user information by hashId
     * @param hashId - user's hash id
     */
    getUser: async (hashId: string): Promise<UserResponse> => {
      const response = await isofetch(ctx, 'GET', `/users/${hashId}`);

      // TODO: error handling if response is not json
      return await response.json();
    },
  };
};

export default UserApi;
