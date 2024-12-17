import { ProductResponse } from './product';

export type ChargeQueryParams = {
  page?: number;
  perPage?: number;
  sort?: string;
  status?: 'active' | 'expiring' | 'expired' | 'deleted' | 'suspended';
  active?: boolean;
};

export type ScheduleChargeResponse = {
  id: string;
  nextOccurrencesOn: string[];
  startOn: string;
  status: string;
  every: number;
  period: string;
  on: {
    weekdays?: string[];
    daysOfMonth?: number[];
    weekdayOfMonth?: string;
  };
  charge: ChargeResponse;
  createdAt: string;
};

export type ChargeResponse = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  customer: string;
  metadata: {
    timestamps: string;
    product: ProductResponse;
  };
  authorizeUri: string;
  isAuthorized: boolean;
  isPaid: boolean;
  createdAt: string;
};

export type ChargeArrayResponse = ChargeResponse[];

export type ScheduleChargeArrayResponse = ScheduleChargeResponse[];
