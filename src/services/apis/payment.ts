import { ServiceContext } from '@services/core';
import { isofetch } from '@services/core/helpers';
import {
  throwIfError,
  CardResponse,
  ProductArrayResponse,
  ChargeQueryParams,
  ChargeArrayResponse,
  ChargeResponse,
  ScheduleChargeResponse,
  ScheduleChargeArrayResponse,
  MessageResponse,
} from '@services/types';

const PaymentApi = (ctx: ServiceContext) => {
  return {
    /**
     * Create Omise Card
     * @param card - Omise card token
     * @param recaptcha - recaptcha
     */
    createCard: async (data: { cardToken: string; recaptcha: string }): Promise<CardResponse> => {
      const response = await isofetch(ctx, 'POST', '/payments/cards', {
        body: data,
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Omise Cards
     */
    getCards: async (): Promise<CardResponse> => {
      const response = await isofetch(ctx, 'GET', '/payments/cards');
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Charge
     */
    charge: async (data: { productHashId: string; recaptcha: string; card?: string }): Promise<ChargeResponse> => {
      const response = await isofetch(ctx, 'POST', '/payments/charges', {
        body: data,
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get charges
     */
    getCharges: async (params: ChargeQueryParams): Promise<ChargeArrayResponse> => {
      const { perPage = 25, ...rest } = params;
      const response = await isofetch(ctx, 'GET', '/payments/charges', {
        query: { per_page: perPage, ...rest },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Create schedule charge
     */
    scheduleCharge: async (data: { productHashId: string; recaptcha: string; card?: string }): Promise<ScheduleChargeResponse> => {
      const response = await isofetch(ctx, 'POST', '/payments/schedule-charges', {
        body: data,
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get schedule charges
     */
    getScheduleCharges: async (params: ChargeQueryParams): Promise<ScheduleChargeArrayResponse> => {
      const { perPage = 25, ...rest } = params;
      const response = await isofetch(ctx, 'GET', '/payments/schedule-charges', {
        query: { per_page: perPage, ...rest },
      });
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Purchase membership
     */
    deleteScheduleCharge: async (scheduleId: string): Promise<MessageResponse> => {
      const response = await isofetch(ctx, 'DELETE', `/payments/schedule-charges/${scheduleId}`);
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
    /**
     * Get Omise Cards
     */
    getProducts: async (): Promise<ProductArrayResponse> => {
      const response = await isofetch(ctx, 'GET', '/payments/products');
      const resJson = await response.json();

      throwIfError(resJson);

      return resJson;
    },
  };
};

export default PaymentApi;
