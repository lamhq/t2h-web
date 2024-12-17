import { UserResponse } from './user';
import { FileResponse, FileArrayResponse } from './file';

export interface ShopRequest {
  title?: string;
  description?: string;
  heroImageFileHashId?: string;
  imageHashIds?: string[];
}

export interface ShopResponse {
  title?: string;
  description?: string;
  user: UserResponse;
  heroImageFile?: FileResponse;
  images: FileArrayResponse;
  hashId: string;
  userHashId: string;
}

export type ShopArrayResponse = ShopResponse[];
