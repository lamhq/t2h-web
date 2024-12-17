export enum FileCategory {
  Item = 'item',
  FraudReport = 'fraud_report',
  SellerApp = 'seller_application',
  MembershipApp = 'membership_application',
  Other = 'other',
}

export enum FilePermission {
  Public = 'public',
  Private = 'private',
}

export interface FileUploadRequest {
  category: FileCategory;
  permission: FilePermission;
  width?: number;
  height?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface FileResponse {
  category: FileCategory;
  filename: string;
  size: number;
  path: string;
  width?: number;
  height?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  permission: FilePermission;
  url: string;
  hashId: string;
}

export type FileArrayResponse = FileResponse[];
