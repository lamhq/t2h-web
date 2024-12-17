import { FileResponse } from './file';
import { ProvinceResponse } from './province-master';
import { PaginationQueryParams } from './common';

export enum ApplicationStatus {
  Pending = 'pending',
  Submitted = 'submitted',
  Approved = 'approved',
  Draft = 'draft',
  Rejected = 'rejected',
}

export enum ApplicationType {
  Individual = 'individual',
  Corporation = 'corporation',
}

export enum MembershipType {
  Buyer = 'buyer',
  Seller = 'seller',
  Pro = 'pro',
  Silver = 'silver',
  Gold = 'gold',
  Premium = 'premium',
}

export type GetSellerApplicationsParams = PaginationQueryParams & { status?: ApplicationStatus | ApplicationStatus[] };

export interface CreateSellerApplicationRequest {
  type: ApplicationType;
  nationalId: string;
  passportNo: string;
  nationalIdCardFileHashId: string;
  selfieFileHashId: string;
  dbdFileHashId: string;
  porpor20FileHashId: string;
  bankBookFileHashId?: string;
  companyName: string;
  companyTaxId: string;
  homeRegistrationDocFileHashId?: string;
  provinceHashId?: string;
  address?: string;
  bankHashId?: string;
  bankAccNo?: string;
  sellerType?: string;
}

export interface CreateSellerApplicationResponse {
  type: ApplicationType;
  nationalId?: string;
  passportNo?: string;
  nationalIdCardFileId?: string;
  selfieFileId?: string;
  dbdFileId?: string;
  porpor20FileId?: string;
  bankBookFileId?: string;
  companyName?: string;
  bankName?: string;
  bankAccNo?: string;
  companyTaxId?: string;
  phone?: string;
  status?: number;
  hashId: string;
  userHashId: string;
}

export interface UpdateSellerApplicationRequest {
  type: ApplicationType;
  nationalId: string;
  passportNo: string;
  nationalIdCardFileHashId: string;
  selfieFileHashId: string;
  dbdFileHashId: string;
  porpor20FileHashId: string;
  bankBookFileHashId: string;
  companyName: string;
  membership: string;
  bankHashId: string;
  bankAccNo: string;
  companyTaxId: string;
  sellerType: string;
}

export interface UpdateSellerApplicationRequest extends CreateSellerApplicationResponse {}

export interface SellerApplicationResponse {
  type: ApplicationType;
  membershipType: MembershipType;
  nationalId?: string;
  passportNo?: string;
  companyName?: string;
  bankHashId?: string;
  bankAccNo?: string;
  companyTaxId?: string;
  phone?: string;
  status?: number;
  nationalIdCardFile?: FileResponse;
  selfieFile?: FileResponse;
  dbdFile?: FileResponse;
  porpor20File?: FileResponse;
  bankBookFile?: FileResponse;
  hashId: string;
  userHashId: string;
  sellerType: string;
  address?: string;
  homeRegistrationDocFile?: FileResponse;
  province?: ProvinceResponse;
}

export type SellerApplicationArrayResponse = SellerApplicationResponse[];
