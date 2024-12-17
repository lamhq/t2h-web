import { AuthenticateProviderArrayResponse } from './authentication-provider';
import { ShopResponse } from './shop';

export type UserStatus = 'active' | 'inactive' | 'draft';

export type UserSellerIndentityType = 'company' | 'corporate';

export type UserSellerType = 'enduser' | 'agent';

export type BankAccount = {
  bankEnglishName: string;
  bankThaiName: string;
  bankLogo: string;
  accountNumber: string;
};

export interface CreateUserRequest {
  username: string;
  email: string;
  displayName?: string;
  firstName: string;
  lastName: string;
  password: string;
  recaptcha: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  mobile?: string;
  status?: UserStatus;
  description?: string;
  address?: string;
  fax?: string;
  homePhone?: string;
  companyName?: string;
  personalWebHomepage?: string;
  province?: string;
  zipcode?: string;
  password?: string;
  recaptcha?: string;
}

export interface UserResponse {
  hashId: string;
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  mobile?: string;
  status: UserStatus;
  membership: string; // TODO enum
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isHomeVerified: boolean;
  isEmailPublic: boolean;
  isMobilePublic: boolean;
  contactNumber?: string;
  contactEmail?: string;
  description?: string;
  address?: string;
  fax?: string;
  nationalId?: string;
  passportNo?: string;
  homePhone?: string;
  companyName?: string;
  companyTaxId?: string;
  personalWebHomepage?: string;
  province?: string;
  district?: string;
  zipcode?: string;
  balance?: number;
  sellerIdentityType?: UserSellerIndentityType;
  sellerType?: UserSellerType;
  roles: string[];
  role: string;
  authenticateProviders?: AuthenticateProviderArrayResponse;
  bankAcc?: BankAccount;
  shop?: ShopResponse;
}

export type UserArrayResponse = UserResponse[];
