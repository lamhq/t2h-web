import { UserResponse } from '@services/types';

export interface CreateCommenRequest {
  message: string;
  visibility: boolean;
  receiverHashId: string;
  parentHashId?: string;
  itemHashId: string;
}

export interface UpdateCommentRequest {
  message: string;
  visibility: boolean;
}

export interface CommentResponse {
  message: string;
  visibility: boolean;
  receiverHashId: string;
  parentHashId: string;
  senderHashId: string;
  hashId: string;
  itemHashId: string;
  children?: CommentResponse[];
  sender: UserResponse;
  timestamp: Date;
}

export type CommentArrayResponse = CommentResponse[];
