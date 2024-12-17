import { ItemResponse } from './item';

export enum BoostType {
  Instant = 'instant',
  Schedule = 'schedule',
}

export enum BoostStatus {
  Scheduled = 'scheduled',
  Boosting = 'boosting',
  Finished = 'finished',
}

export interface BoostRequest {
  startBoostTime?: string;
  finishBoostTime?: string;
  type: BoostType;
}

export interface BoostResponse {
  remainCount: number;
  remainDays: number;
  totalCount: number;
  totalDays: number;
  nextBoostTime: string;
  startBoostTime: string;
  finishBoostTime: string;
  type: BoostType;
  status: BoostStatus;
  hashId: string;
  hashItemId: string;
  item: ItemResponse;
  createdAt: string;
  updatedAt: string;
}

export type BoostArrayResponse = BoostResponse[];
