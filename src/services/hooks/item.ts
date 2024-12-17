import { useState, useCallback } from 'react';
import { ItemApi } from '@services/apis';
import { SearchItemArrayResponse, SearchOrderTypes } from '@services/types';
import { pickNotEmpty } from '@common/utils';
import { getSearchOrderQuery } from '@services/facades/item';
import { SearchItemStatus } from '@components/organisms/SearchFormGroup';
import { useValueChangeDetector } from '@common/utils/hooks';

const DEFAULT_NUM_OF_ITEMS_PER_PAGE = 15;

export interface SearchQuery {
  q: string;
  sorting: SearchOrderTypes;
  lowerBoundPrice: string;
  upperBoundPrice: string;
  purchaseYear: string;
  categoryIds: string;
  province: string;
  brandId: string;
  status: SearchItemStatus;
}

interface UseSearchItemsProps {
  apiClient: ReturnType<typeof ItemApi>;
  page?: number;
  items?: SearchItemArrayResponse;
  expectedTotal?: number;
  onItemFetch?: (page: number, items: SearchItemArrayResponse, expectedTotal: number) => void;
  numOfItemsPerPage?: number;
  query?: Partial<SearchQuery>;
}

export const useSearchItems = (props: UseSearchItemsProps) => {
  const {
    apiClient,
    items: initialItems,
    expectedTotal: initialExpectedTotal,
    //page = 1,
    onItemFetch,
    numOfItemsPerPage = DEFAULT_NUM_OF_ITEMS_PER_PAGE,
    query,
  } = props;
  const [items, setItems] = useState(initialItems || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expectedTotal, setExpectedTotal] = useState(initialExpectedTotal || 0);

  const fetchItems = useCallback(
    async (
      page: number,
      query: Partial<SearchQuery>,
      perPage: number = DEFAULT_NUM_OF_ITEMS_PER_PAGE,
    ): Promise<[SearchItemArrayResponse, number]> => {
      let ret: [SearchItemArrayResponse, number] = [[], 0];

      try {
        setIsLoading(true);

        ret = await apiClient.search({
          ...pickNotEmpty(
            {
              page,
              perPage,
              ...query,
              sorting: undefined,
            },
            true,
          ),
          sort: query.sorting ? getSearchOrderQuery(query.sorting) : null,
        });
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);

        return ret;
      }
    },
    [apiClient],
  );

  const loadAndSetMoreItems = async () => {
    if (!isLoading) {
      const nxtPage = Math.ceil(items.length / numOfItemsPerPage) + 1;
      const [nxtItems, total] = await fetchItems(nxtPage, query, numOfItemsPerPage);
      const newItems = items.concat(nxtItems);

      setItems(newItems);
      setExpectedTotal(total);
      onItemFetch && onItemFetch(nxtPage, newItems, total);
    }
  };

  const loadFirstItems = useCallback(
    async (query: Partial<SearchQuery>) => {
      const [items, expectedTotal] = await fetchItems(1, query);

      setItems(items);
      setExpectedTotal(expectedTotal);
    },
    [fetchItems],
  );

  useValueChangeDetector(query, loadFirstItems);

  return { items, isLoading, error, expectedTotal, loadAndSetMoreItems, fetchItems, setItems, setExpectedTotal };
};
