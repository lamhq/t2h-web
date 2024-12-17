export interface CardResponse {
  id: string;
  brand: string;
  lastDigits: string;
  bank: string;
  name: string;
  expirationYear: number;
  expirationMonth: number;
}

export type CardArrayResponse = CardResponse[];
