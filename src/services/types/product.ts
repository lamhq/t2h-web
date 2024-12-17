export interface ProductResponse {
  type: 'membership' | 'coin';
  price: number;
  paymentType: 'once' | 'monthly' | 'yearly';
  name: string;
  hashId: string;
  metadata: Record<string, any>;
}

export type ProductArrayResponse = ProductResponse[];
