import { FileArrayResponse, FileResponse, BoostArrayResponse, UserResponse } from '@services/types';
import { PaginationQueryParams } from './common';
import { CategoryResponse } from './category-master';
import { BrandResponse } from './brand-master';
import { ModelResponse } from './model-master';

export enum VehicleTransmission {
  Manual = 'manual',
  Automated = 'automated',
  Planetary = 'planetary',
}

export enum AcceptedPaymentType {
  Visa = 'visa',
  BankTransfer = 'bank-transfer',
  Other = 'other',
}

export enum ItemStatus {
  Pending = 'pending',
  Submitted = 'submitted',
  Published = 'published',
  Rejected = 'rejected',
  Draft = 'draft',
  Sold = 'sold',
}

interface BasicItem {
  category: CategoryResponse;
  brand?: BrandResponse;
  model?: ModelResponse;
  productionYear: number;
  transmission?: VehicleTransmission;
  usage: string;
  purchaseYear?: number;
  licencePlate?: string;
  vin?: string;
  vehicleRegistrationBookFileHashId?: string;
}

interface AdditionalItem {
  title: string;
  detail: string;
  pickupLocation?: string;
  imageUrl?: string;
  sellingPrice?: number;
  markdownPrice?: number;
  imageHashIds?: string[];
}

export type CreateItemRequest = {
  categoryHashId: string;
  brandHashId: string;
  modelHashId: string;
  productionYear: number;
  usage: string;
  purchaseYear?: number;
  licencePlate?: string;
  vin?: string;
  vehicleRegistrationBookFileHashId?: string;
};

export type EditItemRequest = Partial<CreateItemRequest> & AdditionalItem;

export interface ItemResponse extends BasicItem, Omit<AdditionalItem, 'sellingPrice'> {
  sellingPrice: number;
  status: ItemStatus;
  hashId: string;
  userHashId: string;
  user: UserResponse;
  images: FileArrayResponse;
  boosts: BoostArrayResponse;
  isFavorite: boolean;
  favoriteHashId: string;
  vehicleRegistrationBookFile?: FileResponse;
}

export type ItemArrayResponse = ItemResponse[];

type SearchQueryParams = Partial<{
  username: string;
  email: string;
  mobile: string;
  category: string;
}>;

export type GetItemParams = PaginationQueryParams & { status?: ItemStatus | ItemStatus[]; q?: string };

export type GetItemsParams = PaginationQueryParams & SearchQueryParams & { q?: string };

export type SearchItemParams = PaginationQueryParams & {
  q?: string;
  lowerBoundPrice?: number;
  upperBoundPrice?: number;
  purchaseYear?: number;
  categoryId?: number;
  area?: string;
  province?: string;
  brandId?: number;
  status?: ItemStatus;
};

export type SearchItemArrayResponse = Omit<ItemResponse, 'images'>[];

export enum ReportReason {
  Content = 'content_related_issue',
  Fraud = 'fraudulent_listing',
  Copyright = 'copyright_claim',
  Other = 'other',
}

export type ReportItemRequest = {
  type: ReportReason;
  itemHashId: string;
  content: string;
  attachmentFileHashId?: string;
};

export enum SearchOrderTypes {
  HighestPrice = 'highest_price',
  LowestPrice = 'lowest_price',
  Newest = 'newest',
  Recommended = 'recommended',
}
