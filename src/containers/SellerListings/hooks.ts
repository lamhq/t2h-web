import React from 'react';
import { getMaxPage } from '@common/utils';
import { ItemArrayResponse, UserResponse, FavoriteResponse, FavoriteArrayResponse } from '@services/types';
import { useDelayState } from '@common/utils/hooks';
import { useAuthContext } from '@hocs/withAuth';

export interface SellerListingsInitialData {
  loadItems: (page: number, perPage: number, username: string, searchWord: string) => Promise<[ItemArrayResponse, number]>;
  getFavorites: (itemIds: string[]) => Promise<[FavoriteArrayResponse, number]>;

  user: UserResponse;
  defaultItems: ItemArrayResponse;
  defaultNumberOfItems: number;
  numberOfItemsPerPage: number;
  intervalOfSearch: number;
}

export interface SellerListingsStateData {
  viewSearchWord: string;
  items: ItemArrayResponse;
  numberOfItems: number;
  page: number;
  startIndex: number;
  lastIndex: number;

  onSearchWordChange: React.ChangeEventHandler;
  moveToPrevPage: () => Promise<void>;
  moveToNextPage: () => Promise<void>;
  itemHashIdToFavorite: { [key: string]: FavoriteResponse };
  setFavorite: (itemHashId: string, favorite: FavoriteResponse) => void;
}

export const useSellerListingsState = (init: SellerListingsInitialData): SellerListingsStateData => {
  const [items, setItems] = React.useState(init.defaultItems);
  const [numberOfItems, setNumberOfItems] = React.useState(init.defaultNumberOfItems);
  const [page, setPage] = React.useState(1);
  const [itemHashIdToFavorite, setItemHashIdToFavorite] = React.useState({});

  const me = useAuthContext();

  React.useEffect(() => {
    (async () => {
      if (me) {
        const itemHashIdToFavorite: { [key: string]: FavoriteResponse } = {};
        const itemHashIds = items.map((i) => i.hashId);
        const [favorites] = await init.getFavorites(itemHashIds);

        for (const fav of favorites) {
          itemHashIdToFavorite[fav.itemHashId] = fav;
        }
        setItemHashIdToFavorite(itemHashIdToFavorite);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [viewSearchWord, searchWord, setSearchWord] = useDelayState('', init.intervalOfSearch);
  const onSearchWordChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchWord(e.target.value);
    },
    [setSearchWord],
  );

  const loadItems = React.useCallback(
    async (page: number, searchWord?: string) => {
      const [items, numberOfItems] = await init.loadItems(page, init.numberOfItemsPerPage, init.user.username, searchWord);

      setItems(items);
      setNumberOfItems(numberOfItems);
      setPage(page);

      if (me) {
        const itemIds = items.map((i) => i.hashId);
        const [newFavorites] = await init.getFavorites(itemIds);

        setItemHashIdToFavorite((itemHashIdToFavorite) => {
          const newItemHashToFavorite = { ...itemHashIdToFavorite };

          for (const fav of newFavorites) {
            newItemHashToFavorite[fav.itemHashId] = fav;
          }

          return newItemHashToFavorite;
        });
      }
    },
    [setItems, setNumberOfItems, setPage, init, me, setItemHashIdToFavorite],
  );

  const moveToPrevPage = React.useCallback(async () => {
    const newPage = Math.max(1, page - 1);

    return loadItems(newPage, searchWord);
  }, [loadItems, page, searchWord]);
  const moveToNextPage = React.useCallback(async () => {
    const maxPage = getMaxPage(numberOfItems, init.numberOfItemsPerPage);
    const newPage = Math.min(maxPage, page + 1);

    return loadItems(newPage, searchWord);
  }, [loadItems, init, page, numberOfItems, searchWord]);

  const setFavorite = React.useCallback(
    (itemHashId: string, favorite: FavoriteResponse) => {
      setItemHashIdToFavorite((itemHashIdToFavorite) => {
        return {
          ...itemHashIdToFavorite,
          [itemHashId]: favorite,
        };
      });
    },
    [setItemHashIdToFavorite],
  );

  React.useEffect(() => {
    loadItems(1, searchWord);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWord]);

  const startIndex = init.numberOfItemsPerPage * (page - 1) + 1;
  const lastIndex = init.numberOfItemsPerPage * (page - 1) + items.length;

  return {
    viewSearchWord,
    items,
    numberOfItems,
    page,
    startIndex,
    lastIndex,
    onSearchWordChange,
    moveToPrevPage,
    moveToNextPage,
    itemHashIdToFavorite,
    setFavorite,
  };
};
