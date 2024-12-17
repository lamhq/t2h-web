export enum SocialProviderType {
  Facebook = 'facebook',
  Line = 'line',
}

export type AuthenticateProviderResponse = {
  providerId: string;
  provider: SocialProviderType;
};

export type AuthenticateProviderArrayResponse = AuthenticateProviderResponse[];
