import React from 'react';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from '@server/i18n';
import { ItemApi, FavoriteApi } from '@services/apis';
import { UserResponse, ItemArrayResponse, ItemResponse, FavoriteResponse } from '@services/types';
import { useGlobalSpinnerActionsContext } from '@contexts/GlobalSpinnerContext';
import { useGlobalSnackbarActionsContext } from '@contexts/GlobalSnackbarContext';
import SellerListings from '@components/organisms/SellerListings';
import { useAuthContext } from '@hocs/withAuth';
import { SingletonRouter } from 'next/router';
import { useSellerListingsState } from './hooks';

interface MyListingsContainerProps extends WithTranslation {
  itemApi: ReturnType<typeof ItemApi>;
  router: SingletonRouter;
  favoriteApi: ReturnType<typeof FavoriteApi>;
  user: UserResponse;
  defaultItems: ItemArrayResponse;
  defaultNumberOfItems: number;
  numberOfItemsPerPage: number;
  intervalOfSearch: number;
}

const SellerListingsContainer = (props: MyListingsContainerProps) => {
  const { t, router, itemApi, favoriteApi, user, defaultItems, defaultNumberOfItems, numberOfItemsPerPage, intervalOfSearch } = props;
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const setGlobalSnackbar = useGlobalSnackbarActionsContext();
  const me = useAuthContext();

  const loadItems = React.useCallback(
    async (page: number, perPage: number, username: string, searchWord: string) => {
      setGlobalSpinner(true);
      try {
        return itemApi.getItems({ page, perPage: perPage, username: username, q: searchWord });
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      } finally {
        setGlobalSpinner(false);
      }
    },
    [t, itemApi, setGlobalSpinner, setGlobalSnackbar],
  );

  const getFavorites = React.useCallback(
    async (itemIds: string[]) =>
      favoriteApi.getMyFavorites({
        page: 1,
        perPage: itemIds.length,
        itemIds,
      }),
    [favoriteApi],
  );

  const listingsState = useSellerListingsState({
    loadItems,
    getFavorites,
    user,
    defaultItems,
    defaultNumberOfItems,
    numberOfItemsPerPage,
    intervalOfSearch,
  });

  const onPreviousClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await listingsState.moveToPrevPage();
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      }
    },
    [t, setGlobalSnackbar, listingsState],
  );
  const onNextClick = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await listingsState.moveToNextPage();
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      }
    },
    [t, setGlobalSnackbar, listingsState],
  );

  const onFavoriteIconClick = React.useCallback(
    async (e: React.MouseEvent, index: number, item: ItemResponse) => {
      e.preventDefault();
      if (!me) {
        return router.push('/signin');
      }

      try {
        const favorite = listingsState.itemHashIdToFavorite[item.hashId];

        let newFavorite: FavoriteResponse | null = null;

        if (favorite) {
          await favoriteApi.deleteFavorite(favorite.hashId);
        } else {
          newFavorite = await favoriteApi.createFavorite({ itemHashId: item.hashId });
        }

        listingsState.setFavorite(item.hashId, newFavorite);
      } catch (error) {
        setGlobalSnackbar({ message: t(error.message), variant: 'error' });
      }
    },
    [t, setGlobalSnackbar, favoriteApi, me, listingsState],
  );

  return (
    <SellerListings
      items={listingsState.items}
      numberOfItems={listingsState.numberOfItems}
      startIndex={listingsState.startIndex}
      lastIndex={listingsState.lastIndex}
      viewSearchWord={listingsState.viewSearchWord}
      onSearchWordChange={listingsState.onSearchWordChange}
      onFavoriteIconClick={onFavoriteIconClick}
      onPreviousClick={onPreviousClick}
      onNextClick={onNextClick}
      itemHashIdToFavorite={listingsState.itemHashIdToFavorite}
    />
  );
};

export default withTranslation('common')(SellerListingsContainer);
