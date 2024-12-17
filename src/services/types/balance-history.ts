export interface BalanceHistoryResponse {
  note?: string;
  type: 'purchased' | 'consumed';
  coin: string;
  purchasePrice: number;
  createdAt: string;
  updatedAt: string;
}

export type BalanceHistoryArrayResponse = BalanceHistoryResponse[];
