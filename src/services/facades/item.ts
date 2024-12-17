import { GetServerSidePropsContext } from 'next';
import { createApiClient } from '@services/core';
import { ItemApi } from '@services/apis';
import { ItemResponse, SearchOrderTypes } from '@services/types';

export const parseSearchOrderType = (searchType: string): SearchOrderTypes | null => {
  switch (searchType) {
    case SearchOrderTypes.HighestPrice:
      return SearchOrderTypes.HighestPrice;
    case SearchOrderTypes.LowestPrice:
      return SearchOrderTypes.LowestPrice;
    case SearchOrderTypes.Newest:
      return SearchOrderTypes.Newest;
    case SearchOrderTypes.Recommended:
      return SearchOrderTypes.Recommended;
    default: {
      return null;
    }
  }
};

export const getSearchOrderQuery = (searchType: SearchOrderTypes): string => {
  switch (searchType) {
    case SearchOrderTypes.HighestPrice:
      return 'sellingPrice|DESC';
    case SearchOrderTypes.LowestPrice:
      return 'sellingPrice|ASC';
    case SearchOrderTypes.Newest:
      return 'createdAt|DESC';
    case SearchOrderTypes.Recommended:
      return 'createdAt|DESC';
    default: {
      const invalidType: never = searchType;

      throw new Error(`${invalidType} is not SearchOrderOptions`);
    }
  }
};

export const getItemData = async (ctx: GetServerSidePropsContext<{}>) => {
  let itemId: string | null = null;
  let itemData: ItemResponse | null = null;
  const hashId = (ctx.query.hashId || '').toString() || '';

  if (hashId.length > 0) {
    const itemAPI = createApiClient(ItemApi, ctx);
    const result = await itemAPI.getItem(decodeURIComponent(hashId));

    itemId = hashId;
    itemData = result;
  }

  return { itemId, itemData };
};

export const searchItems = async (perPage: number, ctx: GetServerSidePropsContext<{}>, isFetchAll: boolean = true) => {
  const q = (ctx.query.q || '').toString();
  const page = Number(ctx.query.page) || 1;
  const itemAPI = createApiClient(ItemApi, ctx);

  if (isFetchAll) {
    return await itemAPI.search({ q, page: 1, perPage: page * perPage });
  } else {
    return await itemAPI.search({ q, page, perPage });
  }
};
